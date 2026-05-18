import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { FoxMascot } from '../src/components/FoxMascot';
import { useFox, FOX_STAGES, getWordsForNextStage } from '../src/store/foxStore';
import { achievements } from '../src/data/achievements';

const ENCOURAGEMENTS = {
  happy: ['今天也要加油哦！🐾', '飞狐陪你一起学习！', '开始今天的冒险吧！'],
  sleepy: ['休息一下再学习吧...😴', '睡饱了精神更好！', '别让飞狐等太久哦'],
  hungry: ['肚子饿了先吃点东西吧~', '飞狐也想吃零食！🍪', '补充能量再来挑战！'],
  proud: ['太厉害了！继续保持！🏆', '飞狐为你骄傲！✨', '你就是词林高手！'],
  excited: ['新词汇等着你呢！🚀', '冲鸭！💪', '飞狐已经迫不及待了！'],
};

// 10级飞狐等级名称
const FOX_LEVEL_NAMES = [
  '小学徒', '入门小将', '词汇新星', '词汇达人', 
  '飞狐学徒', '飞狐使者', '飞狐骑士', '飞狐领主', 
  '神话飞狐', '传说存在'
];

// 获取等级颜色
const getLevelColor = (stage: number): string => {
  if (stage >= 7) return '#FFD700'; // 金色
  if (stage >= 5) return '#9966CC'; // 紫色
  if (stage >= 3) return '#70AD47'; // 绿色
  return '#5B9BD5'; // 蓝色
};

export default function FoxHome() {
  const router = useRouter();
  const { state } = useFox();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCostume, setShowCostume] = useState(false);
  const [encouragement, setEncouragement] = useState('');

  const currentStage = state.stage;
  const currentFoxInfo = FOX_STAGES[currentStage as keyof typeof FOX_STAGES] || FOX_STAGES[0];
  const levelColor = getLevelColor(currentStage);

  useEffect(() => {
    const encouragements = ENCOURAGEMENTS[state.mood] || ENCOURAGEMENTS.happy;
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  }, [state.mood]);

  const todayWords = state.lastStudyDate === new Date().toDateString() ? state.totalWords % 10 : 0;
  
  // 计算升级进度
  const nextStageWords = getWordsForNextStage(currentStage);
  const progressPercent = nextStageWords 
    ? Math.min((state.totalWords / nextStageWords) * 100, 100) 
    : 100;
  const wordsNeeded = nextStageWords ? nextStageWords - state.totalWords : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>飞狐之家</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* 飞狐展示区 */}
        <View style={styles.foxSection}>
          <FoxMascot size={180} mood={state.mood} stage={currentStage} animated={true} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{encouragement}</Text>
          </View>
        </View>

        {/* 等级信息 */}
        <View style={styles.profileSection}>
          <Text style={styles.foxName}>{currentFoxInfo.name}</Text>
          <View style={[styles.stageBadge, { backgroundColor: levelColor }]}>
            <Text style={styles.stageName}>Lv.{currentStage + 1}</Text>
          </View>
        </View>

        {/* 统计数据卡片 */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>今日状态</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{todayWords}</Text>
              <Text style={styles.statLabel}>已学词</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{state.consecutiveDays}</Text>
              <Text style={styles.statLabel}>连续天数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: levelColor }]}>{state.totalWords}</Text>
              <Text style={styles.statLabel}>总词汇</Text>
            </View>
          </View>
          
          {/* 升级进度条 */}
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>下一等级：{FOX_LEVEL_NAMES[Math.min(currentStage + 1, 9)]}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: levelColor }]} />
            </View>
            <Text style={styles.progressWords}>
              {currentStage < 9 ? `还差${wordsNeeded}词` : '已满级 🎉'}
            </Text>
          </View>
        </View>

        {/* 外观描述 */}
        <View style={styles.descCard}>
          <Text style={styles.descLabel}>当前外观</Text>
          <Text style={styles.descText}>{currentFoxInfo.description}</Text>
        </View>

        {/* 操作按钮区 */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn, { backgroundColor: levelColor }]} onPress={() => router.push('/middle/learn')}>
            <Text style={styles.actionEmoji}>🎯</Text>
            <Text style={styles.actionText}>继续学习</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => setShowAchievements(true)}>
            <Text style={styles.actionEmoji}>🏆</Text>
            <Text style={[styles.actionText, styles.secondaryText]}>成就墙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => setShowCostume(true)}>
            <Text style={styles.actionEmoji}>👕</Text>
            <Text style={[styles.actionText, styles.secondaryText]}>换装</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={() => router.push('/')}>
            <Text style={styles.actionEmoji}>🏠</Text>
            <Text style={[styles.actionText, styles.secondaryText]}>返回首页</Text>
          </TouchableOpacity>
        </View>

        {/* 最近成就展示 */}
        <View style={styles.achievementBar}>
          <Text style={styles.achievementBarTitle}>最近成就</Text>
          <View style={styles.achievementIcons}>
            {state.unlockedAchievements.slice(-5).map((id, index) => {
              const achievement = achievements.find(a => a.id === id);
              return achievement ? (
                <Text key={index} style={styles.achievementIcon}>{achievement.icon}</Text>
              ) : null;
            })}
            {state.unlockedAchievements.length === 0 && (
              <Text style={styles.noAchievement}>完成学习解锁成就</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* 成就墙弹窗 */}
      <Modal visible={showAchievements} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🏆 成就墙</Text>
              <TouchableOpacity onPress={() => setShowAchievements(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.achievementList}>
              {achievements.map((achievement) => {
                const unlocked = state.unlockedAchievements.includes(achievement.id);
                return (
                  <View key={achievement.id} style={[styles.achievementItem, !unlocked && styles.achievementLocked]}>
                    <Text style={styles.achievementItemIcon}>{achievement.icon}</Text>
                    <View style={styles.achievementItemInfo}>
                      <Text style={styles.achievementItemName}>{achievement.name}</Text>
                      <Text style={styles.achievementItemDesc}>{achievement.description}</Text>
                    </View>
                    {unlocked && <Text style={styles.unlockedBadge}>✓</Text>}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* 换装弹窗 */}
      <Modal visible={showCostume} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>👕 飞狐衣柜</Text>
              <TouchableOpacity onPress={() => setShowCostume(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.costumeGrid}>
              {Object.entries(FOX_STAGES).map(([stage, info]) => {
                const stageNum = parseInt(stage);
                const isUnlocked = stageNum <= currentStage;
                const stageColor = getLevelColor(stageNum);
                return (
                  <View key={stage} style={[styles.costumeItem, isUnlocked && styles.costumeUnlocked]}>
                    <FoxMascot size={60} mood="happy" stage={stageNum} />
                    <Text style={[styles.costumeName, { color: stageColor }]}>{info.name}</Text>
                    <Text style={styles.costumeStatus}>
                      {isUnlocked ? '已解锁' : `${info.minWords}+词`}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.costumeHint}>学习更多词汇解锁新外观</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F0' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 16, color: '#FF9ECD', fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  foxSection: { alignItems: 'center', marginBottom: 20 },
  speechBubble: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16, maxWidth: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  speechText: { fontSize: 16, color: '#333', textAlign: 'center' },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  foxName: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  stageBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  stageName: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  statsCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statsTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#FF9ECD' },
  statLabel: { fontSize: 14, color: '#888', marginTop: 4 },
  statDivider: { width: 1, height: 50, backgroundColor: '#EEE' },
  progressSection: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#EEE' },
  progressLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressWords: { fontSize: 12, color: '#888', marginTop: 6, textAlign: 'right' },
  descCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, alignItems: 'center' },
  descLabel: { fontSize: 12, color: '#999', marginBottom: 4 },
  descText: { fontSize: 16, color: '#666' },
  actionsSection: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 8 },
  primaryBtn: { backgroundColor: '#FF9ECD' },
  secondaryBtn: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#FF9ECD' },
  actionEmoji: { fontSize: 20 },
  actionText: { fontSize: 16, fontWeight: '600', color: '#FFF' },
  secondaryText: { color: '#FF9ECD' },
  achievementBar: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  achievementBarTitle: { fontSize: 14, color: '#888' },
  achievementIcons: { flexDirection: 'row', gap: 8 },
  achievementIcon: { fontSize: 24 },
  noAchievement: { fontSize: 12, color: '#CCC' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeBtn: { fontSize: 24, color: '#888' },
  achievementList: { maxHeight: 400 },
  achievementItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  achievementLocked: { opacity: 0.4 },
  achievementItemIcon: { fontSize: 32, marginRight: 16 },
  achievementItemInfo: { flex: 1 },
  achievementItemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  achievementItemDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  unlockedBadge: { fontSize: 20, color: '#4ECDC4' },
  costumeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  costumeItem: { width: '30%', alignItems: 'center', padding: 12, backgroundColor: '#F5F5F5', borderRadius: 16, marginBottom: 12 },
  costumeUnlocked: { backgroundColor: '#FFF8F0' },
  costumeName: { fontSize: 11, fontWeight: '600', marginTop: 6, textAlign: 'center' },
  costumeStatus: { fontSize: 10, color: '#888', marginTop: 4 },
  costumeHint: { textAlign: 'center', fontSize: 12, color: '#888', marginTop: 20 },
});
