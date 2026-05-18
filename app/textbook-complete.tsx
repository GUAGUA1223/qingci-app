// 课本毕业典礼页面
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Animated, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { FoxMascot } from '../src/components/FoxMascot';
import { useFox, FOX_STAGES } from '../src/store/foxStore';
import { getExpansionPacksByStage, getAllExpansionPacksForStage } from '../src/data/expansionPacks';
import { Stage } from '../src/types/vocabulary';

interface TextbookCompleteProps {
  textbookName?: string;
  textbookId?: string;
  stage?: Stage;
  totalWords?: number;
}

export default function TextbookComplete({ 
  textbookName = '人教版四年级上册', 
  textbookId = '',
  stage = 'primary',
  totalWords = 100 
}: TextbookCompleteProps) {
  const router = useRouter();
  const { state: foxState } = useFox();
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const confettiAnim = React.useRef(new Animated.Value(0)).current;
  const graduateAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setShowConfetti(true);
    
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(graduateAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(600),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    setCurrentStage(foxState.stage);
  }, []);

  const handleReview = () => {
    router.push('/review');
  };

  const handleExpansionPacks = () => {
    router.push('/expansion-packs');
  };

  const handlePreviewNext = () => {
    router.push('/primary/index');
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎓 我完成了《${textbookName}》的学习！\n累计学习了${totalWords}个单词！\n快来和我一起用"轻词"背单词吧~`,
      });
    } catch (error) {
      console.log('Share error:', error);
    }
  };

  const expansionPacks = getAllExpansionPacksForStage(stage);
  const nextTextbook = stage === 'primary' ? '人教版四年级下册' : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.closeBtn}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>毕业典礼</Text>
          <View style={{ width: 40 }} />
        </View>

        {showConfetti && (
          <View style={styles.confettiOverlay}>
            {renderConfetti()}
          </View>
        )}

        <Animated.View
          style={[
            styles.foxSection,
            {
              transform: [
                { scale: graduateAnim },
              ],
            },
          ]}
        >
          <View style={styles.foxWithHat}>
            <FoxMascot size={160} mood="proud" stage={currentStage} animated={true} />
            <View style={styles.graduateHat}>
              <Text style={styles.hatEmoji}>🎓</Text>
            </View>
          </View>
          <View style={styles.speechBubble}>
            <Text style={styles.speechText}>太棒了！你完成了一本课本！🎉</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.certificateCard,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.certificateHeader}>
            <Text style={styles.certificateTitle}>🎓 毕业证书</Text>
          </View>
          <View style={styles.certificateBody}>
            <Text style={styles.certificateSubtitle}>轻词学员</Text>
            <Text style={styles.certificateMain}>顺利完成</Text>
            <Text style={styles.textbookName}>{textbookName}</Text>
            <Text style={styles.certificateStats}>
              学习了 <Text style={styles.highlight}>{totalWords}</Text> 个单词
            </Text>
          </View>
          <View style={styles.certificateFooter}>
            <Text style={styles.certificateDate}>{new Date().toLocaleDateString('zh-CN')}</Text>
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Text style={styles.shareBtnText}>分享</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.nextSection}>
          <Text style={styles.sectionTitle}>🎯 下一步做什么</Text>
          
          <TouchableOpacity style={styles.nextCard} onPress={handleReview}>
            <View style={styles.nextCardLeft}>
              <Text style={styles.nextCardIcon}>📚</Text>
              <View>
                <Text style={styles.nextCardTitle}>复习巩固</Text>
                <Text style={styles.nextCardDesc}>趁热打铁，巩固刚学的词汇</Text>
              </View>
            </View>
            <Text style={styles.nextCardArrow}>→</Text>
          </TouchableOpacity>

          {expansionPacks.length > 0 && (
            <TouchableOpacity style={styles.nextCard} onPress={handleExpansionPacks}>
              <View style={styles.nextCardLeft}>
                <Text style={styles.nextCardIcon}>🎁</Text>
                <View>
                  <Text style={styles.nextCardTitle}>拓展词包</Text>
                  <Text style={styles.nextCardDesc}>学完课本，探索更多有趣词汇</Text>
                </View>
              </View>
              <Text style={styles.nextCardArrow}>→</Text>
            </TouchableOpacity>
          )}

          {nextTextbook && (
            <TouchableOpacity style={styles.nextCardPreview} onPress={handlePreviewNext}>
              <View style={styles.nextCardLeft}>
                <Text style={styles.nextCardIcon}>📖</Text>
                <View>
                  <Text style={styles.nextCardTitle}>预习下学期</Text>
                  <Text style={styles.nextCardDesc}>提前预习，抢跑新学期</Text>
                  <View style={styles.previewBadge}>
                    <Text style={styles.previewBadgeText}>推荐</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.nextCardArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/')}>
          <Text style={styles.homeBtnText}>返回首页</Text>
        </TouchableOpacity>

        <View style={styles.encourageSection}>
          <FoxMascot size={60} mood="excited" stage={currentStage} />
          <Text style={styles.encourageText}>
            继续加油！小狐狸会一直陪着你~ 🦊
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderConfetti() {
    const confettiColors = ['🎉', '🎊', '🌟', '✨', '💫', '🎈', '⭐'];
    const confettiItems = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: confettiColors[i % confettiColors.length],
      left: Math.random() * 100,
      delay: Math.random() * 2000,
      duration: 2000 + Math.random() * 2000,
    }));

    return (
      <View style={styles.confettiContainer}>
        {confettiItems.map((item) => (
          <Animated.View
            key={item.id}
            style={[
              styles.confettiItem,
              {
                left: `${item.left}%`,
                top: -50,
                opacity: confettiAnim,
              },
            ]}
          >
            <Text style={styles.confettiEmoji}>{item.emoji}</Text>
          </Animated.View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  closeBtn: { fontSize: 24, color: '#888' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FF9ECD' },
  confettiOverlay: { position: 'absolute', top: 0, left: 0, right: 0, height: 400, overflow: 'hidden', zIndex: 100 },
  confettiContainer: { position: 'relative', height: '100%' },
  confettiItem: { position: 'absolute' },
  confettiEmoji: { fontSize: 24 },
  foxSection: { alignItems: 'center', marginBottom: 24 },
  foxWithHat: { position: 'relative' },
  graduateHat: { position: 'absolute', top: -20, right: -10 },
  hatEmoji: { fontSize: 40 },
  speechBubble: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16, maxWidth: '80%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  speechText: { fontSize: 16, color: '#333', textAlign: 'center', fontWeight: '600' },
  certificateCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#FFD93D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFD93D',
  },
  certificateHeader: { alignItems: 'center', marginBottom: 16 },
  certificateTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFD93D' },
  certificateBody: { alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  certificateSubtitle: { fontSize: 14, color: '#888' },
  certificateMain: { fontSize: 16, color: '#333', marginTop: 8 },
  textbookName: { fontSize: 20, fontWeight: 'bold', color: '#333', marginTop: 8, textAlign: 'center' },
  certificateStats: { fontSize: 14, color: '#888', marginTop: 12 },
  highlight: { fontSize: 18, fontWeight: 'bold', color: '#FF9ECD' },
  certificateFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  certificateDate: { fontSize: 12, color: '#888' },
  shareBtn: { backgroundColor: '#4ECDC4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  shareBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  nextSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  nextCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  nextCardPreview: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#E8F5FF', borderRadius: 16, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#B8D4F5' },
  nextCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  nextCardIcon: { fontSize: 36, marginRight: 16 },
  nextCardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  nextCardDesc: { fontSize: 12, color: '#888', marginTop: 2 },
  nextCardArrow: { fontSize: 24, color: '#FF9ECD' },
  previewBadge: { backgroundColor: '#4ECDC4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  previewBadgeText: { fontSize: 10, color: '#FFF', fontWeight: '600' },
  homeBtn: { backgroundColor: '#FF9ECD', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 20 },
  homeBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  encourageSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingTop: 12 },
  encourageText: { fontSize: 14, color: '#888' },
});
