import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';
import { primaryWords } from '../../src/data/primaryWords';
import { speakNormal, stopSpeaking } from '../../src/utils/speech';
import { BottomNav } from '../../src/components/BottomNav';

type TabType = 'word' | 'example' | 'exam';

export default function MiddleLearn() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('word');
  const currentWord = primaryWords[currentIndex];

  const handleSpeak = () => speakNormal(currentWord.word);
  const handlePrevious = () => { if (currentIndex > 0) { stopSpeaking(); setCurrentIndex(currentIndex - 1); } };
  const handleNext = () => { if (currentIndex < primaryWords.length - 1) { stopSpeaking(); setCurrentIndex(currentIndex + 1); } };

  const tabs: { key: TabType; label: string }[] = [{ key: 'word', label: '词汇' }, { key: 'example', label: '例句' }, { key: 'exam', label: '考点' }];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'word': return <View style={styles.tabContent}><View style={styles.wordInfo}><Text style={styles.word}>{currentWord.word}</Text><Text style={styles.phonetic}>{currentWord.phonetic}</Text></View><View style={styles.divider} /><Text style={styles.meaning}>{currentWord.meaning}</Text><Text style={styles.memoryTip}>{currentWord.memoryTip}</Text></View>;
      case 'example': return <View style={styles.tabContent}><Text style={styles.exampleLabel}>例句</Text><Text style={styles.exampleSentence}>{currentWord.sentence}</Text><TouchableOpacity style={styles.speakButton} onPress={handleSpeak}><Text style={styles.speakButtonText}>🔊 朗读例句</Text></TouchableOpacity></View>;
      case 'exam': return <View style={styles.tabContent}><View style={styles.examPoint}><Text style={styles.examLabel}>考点</Text><Text style={styles.examText}>常考搭配：{currentWord.word} + {currentWord.meaning}</Text></View><View style={styles.examPoint}><Text style={styles.examLabel}>辨析</Text><Text style={styles.examText}>注意与同根词的区分</Text></View></View>;
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
      <BottomNav stage="middle" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.middle.background },
  scrollContent: { padding: 20 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  backText: { fontSize: 16, color: colors.middle.primary, fontWeight: '600' },
  progressBar: { flex: 1, height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.middle.primary, borderRadius: 3 },
  progressText: { fontSize: 14, color: colors.middle.text, fontWeight: '600' },
  previewCard: { backgroundColor: colors.middle.card, borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  previewWord: { fontSize: 40, fontWeight: 'bold', color: colors.middle.text },
  previewPhonetic: { fontSize: 16, color: '#888', marginTop: 8 },
  speakBtn: { marginTop: 16, backgroundColor: colors.middle.primary, width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  speakEmoji: { fontSize: 22 },
  tabContainer: { flexDirection: 'row', backgroundColor: colors.middle.card, borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 8 },
  tabActive: { backgroundColor: colors.middle.primary },
  tabLabel: { fontSize: 14, color: '#666', fontWeight: '600' },
  tabLabelActive: { color: '#FFF' },
  tabContent: { backgroundColor: colors.middle.card, borderRadius: 16, padding: 20, minHeight: 180 },
  wordInfo: { alignItems: 'center' },
  word: { fontSize: 28, fontWeight: 'bold', color: colors.middle.text },
  phonetic: { fontSize: 16, color: '#888', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 16 },
  meaning: { fontSize: 24, fontWeight: '600', color: colors.middle.primary, textAlign: 'center' },
  memoryTip: { fontSize: 14, color: '#888', textAlign: 'center', marginTop: 12 },
  exampleLabel: { fontSize: 14, color: colors.middle.primary, fontWeight: '600', marginBottom: 12 },
  exampleSentence: { fontSize: 18, color: colors.middle.text, lineHeight: 28, fontStyle: 'italic' },
  speakButton: { backgroundColor: colors.middle.secondary, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 20 },
  speakButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  examPoint: { marginBottom: 16 },
  examLabel: { fontSize: 14, color: colors.middle.primary, fontWeight: '600', marginBottom: 6 },
  examText: { fontSize: 16, color: colors.middle.text, lineHeight: 24 },
  actionContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, gap: 12 },
  actionBtn: { flex: 1, backgroundColor: colors.middle.card, paddingVertical: 14, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { fontSize: 14, color: colors.middle.text, fontWeight: '600' },
  masterBtn: { flex: 1, backgroundColor: colors.middle.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  masterBtnText: { fontSize: 14, color: '#FFF', fontWeight: 'bold' },
});
