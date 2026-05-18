// 拓展词包列表页
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFox } from '../src/store/foxStore';
import { useProgress } from '../src/store/progressStore';
import { EXPANSION_PACKS, ExpansionPack, getExpansionPacksByStage } from '../src/data/expansionPacks';
import { Stage } from '../src/types/vocabulary';
import { FoxMascot } from '../src/components/FoxMascot';

interface ExpansionPacksProps {
  stage?: Stage;
}

export default function ExpansionPacks({ stage = 'primary' }: ExpansionPacksProps) {
  const router = useRouter();
  const { state: foxState } = useFox();
  const { completedTextbooks } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const stagePacks = getExpansionPacksByStage(stage);
  const isUnlocked = completedTextbooks.length > 0;

  const categories = [
    { id: 'all', name: '全部', icon: '📦' },
    { id: 'primary', name: '小学', icon: '🏫' },
    { id: 'middle', name: '初中', icon: '📖' },
    { id: 'high', name: '高中', icon: '🎓' },
  ];

  const filteredPacks = selectedCategory === 'all' 
    ? stagePacks 
    : stagePacks.filter(pack => pack.stage === selectedCategory);

  const handlePackPress = (pack: ExpansionPack) => {
    if (!isUnlocked) return;
    router.push({
      pathname: '/middle/learn',
      params: { packId: pack.id },
    });
  };

  const renderPackCard = ({ item: pack }: { item: ExpansionPack }) => (
    <TouchableOpacity 
      style={[styles.packCard, !isUnlocked && styles.packCardLocked]} 
      onPress={() => handlePackPress(pack)}
      activeOpacity={isUnlocked ? 0.8 : 1}
    >
      <View style={styles.packHeader}>
        <Text style={styles.packIcon}>{pack.icon}</Text>
        <View style={[styles.stageTag, styles[`stageTag_${pack.stage}`]]}>
          <Text style={styles.stageTagText}>
            {pack.stage === 'primary' ? '小学' : pack.stage === 'middle' ? '初中' : '高中'}
          </Text>
        </View>
      </View>
      <Text style={styles.packName}>{pack.name}</Text>
      <Text style={styles.packDesc}>{pack.description}</Text>
      <View style={styles.packFooter}>
        <Text style={styles.wordCount}>📝 {pack.wordCount}词</Text>
        {!isUnlocked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>🔒 完成课本解锁</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backBtn}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.title}>拓展词包</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.introCard}>
          <FoxMascot size={60} mood="excited" stage={foxState.stage} />
          <View style={styles.introContent}>
            <Text style={styles.introTitle}>探索更多有趣词汇</Text>
            <Text style={styles.introText}>
              {isUnlocked 
                ? '课本学完了？来拓展更多词汇吧！'
                : '完成一本课本即可解锁拓展词包~'}
            </Text>
          </View>
        </View>

        {!isUnlocked && (
          <View style={styles.unlockHint}>
            <Text style={styles.unlockHintIcon}>💡</Text>
            <View style={styles.unlockHintContent}>
              <Text style={styles.unlockHintTitle}>解锁条件</Text>
              <Text style={styles.unlockHintText}>完成任意一本课本即可解锁全部拓展词包</Text>
            </View>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryTag, selectedCategory === cat.id && styles.categoryTagActive]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryText, selectedCategory === cat.id && styles.categoryTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.packList}>
          <Text style={styles.sectionTitle}>📚 可学词包</Text>
          {filteredPacks.length > 0 ? (
            <View style={styles.packGrid}>
              {filteredPacks.map((pack) => (
                <View key={pack.id} style={styles.packItem}>
                  {renderPackCard({ item: pack })}
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>该分类暂无词包</Text>
            </View>
          )}
        </View>

        <View style={styles.completedSection}>
          <Text style={styles.completedTitle}>✨ 已完成</Text>
          <Text style={styles.completedText}>暂无已完成的拓展词包</Text>
        </View>

        <TouchableOpacity style={styles.backToHomeBtn} onPress={() => router.push('/')}>
          <Text style={styles.backToHomeBtnText}>返回首页</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F8' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backBtn: { fontSize: 16, color: '#FF9ECD', fontWeight: '600' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#FF9ECD' },
  introCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  introContent: { flex: 1, marginLeft: 16 },
  introTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  introText: { fontSize: 14, color: '#888', marginTop: 4 },
  unlockHint: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9E6', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#FFE4B5' },
  unlockHintIcon: { fontSize: 32, marginRight: 12 },
  unlockHintContent: { flex: 1 },
  unlockHintTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  unlockHintText: { fontSize: 12, color: '#888', marginTop: 2 },
  categoryScroll: { marginBottom: 16 },
  categoryContainer: { flexDirection: 'row', gap: 12 },
  categoryTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  categoryTagActive: { backgroundColor: '#FF9ECD', borderColor: '#FF9ECD' },
  categoryIcon: { fontSize: 16, marginRight: 6 },
  categoryText: { fontSize: 14, color: '#666' },
  categoryTextActive: { color: '#FFF', fontWeight: '600' },
  packList: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  packGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  packItem: { width: '47%' },
  packCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  packCardLocked: { opacity: 0.7 },
  packHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  packIcon: { fontSize: 48 },
  stageTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  stageTag_primary: { backgroundColor: '#E8F5FF' },
  stageTag_middle: { backgroundColor: '#FFF3E0' },
  stageTag_high: { backgroundColor: '#F3E5F5' },
  stageTagText: { fontSize: 10, color: '#666', fontWeight: '600' },
  packName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  packDesc: { fontSize: 12, color: '#888', marginBottom: 12, lineHeight: 18 },
  packFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  wordCount: { fontSize: 12, color: '#4ECDC4', fontWeight: '600' },
  lockBadge: { flexDirection: 'row', alignItems: 'center' },
  lockText: { fontSize: 10, color: '#888' },
  emptyState: { alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 14, color: '#888', marginTop: 12 },
  completedSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 20 },
  completedTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  completedText: { fontSize: 14, color: '#CCC' },
  backToHomeBtn: { backgroundColor: '#FF9ECD', borderRadius: 16, padding: 18, alignItems: 'center' },
  backToHomeBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});
