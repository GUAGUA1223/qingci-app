import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedFox from '../src/components/AnimatedFox';
import { useFox, FOX_STAGES } from '../src/store/foxStore';
import { achievements } from '../src/data/achievements';
import { AnimationType } from '../src/data/animations';
import { foxImages, decoImages, badgeImages } from '../assets/images';

const ENCOURAGEMENTS = {
  happy: ['今天也要加油哦！', '小狐陪你一起学习！', '开始今天的冒险吧！'],
  sleepy: ['休息一下再学习吧...', '睡饱了精神更好！', '别让小狐等太久哦'],
  hungry: ['肚子饿了先吃点东西吧~', '小狐也想吃零食！', '补充能量再来挑战！'],
  proud: ['太厉害了！继续保持！', '小狐为你骄傲！', '你就是词林高手！'],
  excited: ['新词汇等着你呢！', '冲鸭！', '小狐已经迫不及待了！'],
};

const getAnimationFromMood = (mood: string): AnimationType => {
  switch (mood) {
    case 'sleepy': return 'sleepy';
    case 'proud': return 'celebrate';
    case 'excited': return 'celebrate';
    default: return 'idle';
  }
};

export default function FoxHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state } = useFox();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showCostume, setShowCostume] = useState(false);
  const [encouragement, setEncouragement] = useState('');

  const currentStage = FOX_STAGES[state.stage as keyof typeof FOX_STAGES] || FOX_STAGES[0];
  const foxAnimation = getAnimationFromMood(state.mood);

  useEffect(() => {
    const encouragements = ENCOURAGEMENTS[state.mood as keyof typeof ENCOURAGEMENTS] || ENCOURAGEMENTS.happy;
    setEncouragement(encouragements[Math.floor(Math.random() * encouragements.length)]);
  }, [state.mood]);

  const todayWords = state.lastStudyDate === new Date().toDateString() ? state.totalWords % 10 : 0;

  const getFoxStageImage = (stageIndex: number) => {
    switch (stageIndex) {
      case 0: return foxImages.stage0;
      case 1: return foxImages.stage1;
      case 2: return foxImages.stage2;
      case 3: return foxImages.stage3;
      case 4: return foxImages.stage4;
      default: return foxImages.stage0;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.safeAreaTop, { height: insets.top }]} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>小狐狸的家</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* 小狐狸形象 */}
        <View style={styles.foxSection}>
          <AnimatedFox animation={foxAnimation} size={180} />
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>{encouragement}</Text>
          </View>
        </View>

        {/* 角色信息 */}
        <View style={styles.profileSection}>
          <Text style={styles.foxName}>{state.name}</Text>
          <View style={styles.stageBadge}>
            <Text style={styles.stageName}>{currentStage.name}</Text>
          </View>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsCard}>
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
              <Text style={styles.statValue}>{state.totalWords}</Text>
              <Text style={styles.statLabel}>总学词</Text>
            </View>
          </View>
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>下一阶段</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
            <Text style={styles.progressDays}>
              {state.stage < 4 ? `还差${(Object.values(FOX_STAGES)[state.stage + 1] as any).days - state.consecutiveDays}天` : '已满级'}
            </Text>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={() => router.push('/middle/learn')}>
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

        {/* 最近成就徽章 */}
        <View style={styles.achievementBar}>
          <Text style={styles.achievementBarTitle}>最近成就</Text>
          <View style={styles.achievementIcons}>
            {state.unlockedAchievements.slice(-5).map((id, index) => {
              const achievement = achievements.find(a => a.id === id);
              return achievement ? (
                <View key={index} style={styles.achievementImageContainer}>
                  <Image
                    source={badgeImages[achievement.id as keyof typeof badgeImages] || badgeImages.first_word}
                    style={styles.achievementBadgeImage}
                    resizeMode="contain"
                  />
                </View>
              ) : null;
            })}
            {state.unlockedAchievements.length === 0 && (
              <Text style={styles.noAchievement}>完成学习解锁成就</Text>
            )}
          </View>
        </View>

        {/* 装饰品展示 */}
        <View style={styles.decoSection}>
          <Text style={styles.decoSectionTitle}>小窝装饰</Text>
          <View style={styles.decoGrid}>
            <Image source={decoImages.bed} style={styles.decoImage} resizeMode="contain" />
            <Image source={decoImages.lamp} style={styles.decoImage} resizeMode="contain" />
            <Image source={decoImages.plant} style={styles.decoImage} resizeMode="contain" />
          </View>
        </View>
      </ScrollView>

      {/* 成就墙 Modal */}
      <Modal visible={showAchievements} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>成就墙</Text>
              <TouchableOpacity onPress={() => setShowAchievements(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.achievementList}>
              {achievements.map((achievement) => {
                const unlocked = state.unlockedAchievements.includes(achievement.id);
                return (
                  <View key={achievement.id} style={[styles.achievementItem, !unlocked && styles.achievementLocked]}>
                    <Image
                      source={badgeImages[achievement.id as keyof typeof badgeImages] || badgeImages.first_word}
                      style={styles.achievementItemImage}
                      resizeMode="contain"
                    />
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

      {/* 换装 Modal */}
      <Modal visible={showCostume} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>小狐衣柜</Text>
              <TouchableOpacity onPress={() => setShowCostume(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.costumeGrid}>
              {[0, 1, 2, 3, 4].map((stageIdx) => (
                <View key={stageIdx} style={[styles.costumeItem, state.stage >= stageIdx && styles.costumeUnlocked]}>
                  <Image
                    source={getFoxStageImage(stageIdx)}
                    style={styles.costumeFoxImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.costumeName}>
                    {stageIdx === 0 ? '小团子' : stageIdx === 1 ? '竖耳朵' : stageIdx === 2 ? '大尾巴' : stageIdx === 3 ? '金冠狐' : '星空狐'}
                  </Text>
                  <Text style={styles.costumeStatus}>
                    {state.stage >= stageIdx ? '已解锁' : stageIdx === 1 ? '3天' : stageIdx === 2 ? '7天' : stageIdx === 3 ? '21天' : '66天'}
                  </Text>
                </View>
              ))}
            </View>
            <Text style={styles.costumeHint}>坚持学习可解锁新外观</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  safeAreaTop: { backgroundColor: '#FFF5F8' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 18, color: '#FF9ECD', fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FF9ECD' },
  foxSection: { alignItems: 'center', marginBottom: 20 },
  speechBubble: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16, maxWidth: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  speechText: { fontSize: 16, color: '#333', textAlign: 'center' },
  profileSection: { alignItems: 'center', marginBottom: 20 },
  foxName: { fontSize: 24, fontWeight: 'bold', color: '#FF9ECD' },
  stageBadge: { backgroundColor: '#FFD93D', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  stageName: { fontSize: 14, fontWeight: '600', color: '#333' },
  statsCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 32, fontWeight: 'bold', color: '#FF9ECD' },
  statLabel: { fontSize: 14, color: '#888', marginTop: 4 },
  statDivider: { width: 1, height: 50, backgroundColor: '#EEE' },
  progressSection: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#EEE' },
  progressLabel: { fontSize: 14, color: '#888', marginBottom: 8 },
  progressBar: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { width: '30%', height: '100%', backgroundColor: '#FFD93D', borderRadius: 4 },
  progressDays: { fontSize: 12, color: '#888', marginTop: 6, textAlign: 'right' },
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
  achievementImageContainer: { width: 32, height: 32 },
  achievementBadgeImage: { width: 32, height: 32 },
  noAchievement: { fontSize: 12, color: '#CCC' },
  decoSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginTop: 12 },
  decoSectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  decoGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  decoImage: { width: 60, height: 60 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  closeBtn: { fontSize: 24, color: '#888' },
  achievementList: { maxHeight: 400 },
  achievementItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  achievementLocked: { opacity: 0.4 },
  achievementItemImage: { width: 48, height: 48, marginRight: 16 },
  achievementItemInfo: { flex: 1 },
  achievementItemName: { fontSize: 16, fontWeight: '600', color: '#333' },
  achievementItemDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  unlockedBadge: { fontSize: 20, color: '#4ECDC4' },
  costumeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  costumeItem: { width: '30%', alignItems: 'center', padding: 12, backgroundColor: '#F5F5F5', borderRadius: 16, marginBottom: 12 },
  costumeUnlocked: { backgroundColor: '#FFF5F8' },
  costumeFoxImage: { width: 60, height: 60 },
  costumeName: { fontSize: 12, fontWeight: '600', color: '#333', marginTop: 8 },
  costumeStatus: { fontSize: 10, color: '#888', marginTop: 4 },
  costumeHint: { textAlign: 'center', fontSize: 12, color: '#888', marginTop: 20 },
});
