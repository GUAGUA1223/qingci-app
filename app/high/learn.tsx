import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { primaryWords } from '../../src/data/primaryWords';
import { speakNormal, stopSpeaking } from '../../src/utils/speech';
import { BottomNav } from '../../src/components/BottomNav';

type TabType = 'detail' | 'synonym' | '衍生' | 'exam';

export default function HighLearn() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('detail');
  const currentWord = primaryWords[currentIndex];

  const handleSpeak = () => speakNormal(currentWord.word);
  const handlePrevious = () => { if (currentIndex > 0) { stopSpeaking(); setCurrentIndex(currentIndex - 1); } };
  const handleNext = () => { if (currentIndex < primaryWords.length - 1) { stopSpeaking(); setCurrentIndex(currentIndex + 1); } };

  const tabs: { key: TabType; label: string }[] = [{ key: 'detail', label: '详解' }, { key: 'synonym', label: '同义' }, { key: '衍生', label: '衍生' }, { key: 'exam', label: '考点' }];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail': return <View style={styles.tabContent}><View style={styles.detailHeader}><Text style={styles.detailWord}>{currentWord.word}</Text><Text style={styles.detailPhonetic}>{currentWord.phonetic}</Text><Text style={styles.detailMeaning}>{currentWord.meaning}</Text></View><View style={styles.divider} /><View style={styles.detailSection}><Text style={styles.detailLabel}>💡 记忆技巧</Text><Text style={styles.detailText}>{currentWord.memoryTip}</Text></View><View style={styles.detailSection}><Text style={styles.detailLabel}>📖 例句</Text><Text style={styles.detailExample}>{currentWord.sentence}</Text></View></View>;
      case 'synonym': return <View style={styles.tabContent}><Text style={styles.emptyText}>暂无同义词数据</Text></View>;
      case '衍生': return <View style={styles.tabContent}><Text style={styles.emptyText}>暂无衍生词数据</Text></View>;
      case 'exam': return <View style={styles.tabContent}><View style={styles.examSection}><Text style={styles.examLabel}>🎯 考查形式</Text><Text style={styles.examText}>• 词义辨析题{'\n'}• 完形填空{'\n'}• 阅读理解</Text></View><View style={styles.examSection}><Text style={styles.examLabel}>⚠️ 易错点</Text><Text style={styles.examText}>注意词性和词义的区别</Text></View><View style={styles.examSection}><Text style={styles.examLabel}>📝 写作应用</Text><Text style={styles.examText}>可用于表达观点和描述事物</Text></View></View>;
      default: return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressContainer}>
          <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>← 返回</Text></TouchableOpacity>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: `${((currentIndex + 1) / primaryWords.length) * 100}%` }]} /></View>
          <Text style={styles.progressText}>{currentIndex + 1}/{primaryWords.length}</Text>
        </View>
        <View style={styles.previewCard}><Text style={styles.previewWord}>{currentWord.word}</Text><Text style={styles.previewPhonetic}>{currentWord.phonetic}</Text><TouchableOpacity style={styles.speakBtn} onPress={handleSpeak}><Text style={styles.speakEmoji}>🔊</Text></TouchableOpacity></View>
        <View style={styles.tabContainer}>{tabs.map((tab) => (<TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.tabActive]} onPress={() => setActiveTab(tab.key)}><Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>{tab.label}</Text></TouchableOpacity>))}</View>
        {renderTabContent()}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={[styles.actionBtn, currentIndex === 0 && styles.actionBtnDisabled]} onPress={handlePrevious} disabled={currentIndex === 0}><Text style={styles.actionBtnText}>← 上一词</Text></TouchableOpacity>
          <TouchableOpacity style={styles.masterBtn} onPress={handleNext}><Text style={styles.masterBtnText}>下一词 →</Text></TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav stage="high" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.high.background },
  scrollContent: { padding: 20 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backText: { fontSize: 16, color: colors.high.secondary, fontWeight: '600' },
  progressBar: { flex: 1, height: 6, backgroundColor: '#1A1A2E', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.high.secondary, borderRadius: 3 },
  progressText: { fontSize: 14, color: colors.high.text, fontWeight: '600' },
  previewCard: { backgroundColor: colors.high.card, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  previewWord: { fontSize: 42, fontWeight: 'bold', color: colors.high.text },
  previewPhonetic: { fontSize: 16, color: '#888', marginTop: 8 },
  speakBtn: { marginTop: 16, backgroundColor: colors.high.secondary, width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  speakEmoji: { fontSize: 22 },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.high.card, borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8 },
  tabActive: { backgroundColor: colors.high.secondary },
  tabLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  tabLabelActive: { color: '#FFF' },
  tabContent: { backgroundColor: colors.high.card, borderRadius: 16, padding: 20, minHeight: 220 },
  detailHeader: { alignItems: 'center', marginBottom: 16 },
  detailWord: { fontSize: 28, fontWeight: 'bold', color: colors.high.text },
  detailPhonetic: { fontSize: 16, color: '#888', marginTop: 4 },
  detailMeaning: { fontSize: 22, color: colors.high.secondary, marginTop: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#1A1A2E', marginVertical: 16 },
  detailSection: { marginBottom: 16 },
  detailLabel: { fontSize: 14, color: colors.high.secondary, fontWeight: '600', marginBottom: 8 },
  detailText: { fontSize: 16, color: colors.high.text, lineHeight: 24 },
  detailExample: { fontSize: 16, color: colors.high.text, lineHeight: 24, fontStyle: 'italic' },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 60 },
  examSection: { marginBottom: 16 },
  examLabel: { fontSize: 14, color: colors.high.secondary, fontWeight: '600', marginBottom: 8 },
  examText: { fontSize: 15, color: colors.high.text, lineHeight: 24 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  actionBtn: { flex: 1, backgroundColor: colors.high.card, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { fontSize: 14, color: colors.high.text, fontWeight: '600' },
  masterBtn: { flex: 1, backgroundColor: colors.high.secondary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  masterBtnText: { fontSize: 14, color: '#FFF', fontWeight: 'bold' },
});
