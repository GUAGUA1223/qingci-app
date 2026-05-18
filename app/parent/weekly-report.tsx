import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { FoxMascot } from '../../src/components/FoxMascot';
import { mockWeeklyReport, generateHighlights } from '../../src/data/mockReportData';
import { WeeklyReport } from '../../src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 180;
const BAR_WIDTH = (CHART_WIDTH - 60) / 7;
const WEEK_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export default function WeeklyReportPage() {
  const router = useRouter();
  const [report] = useState<WeeklyReport>(mockWeeklyReport);
  const [highlights, setHighlights] = useState<string[]>([]);

  useEffect(() => {
    setHighlights(generateHighlights(report));
  }, [report]);

  const maxDailyWords = Math.max(...report.dailyWords, 1);

  const getWeekDateRange = () => {
    const start = new Date(report.weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return `${start.getMonth() + 1}月${start.getDate()}日 - ${end.getMonth() + 1}月${end.getDate()}日`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 学习周报</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.overviewCard}>
          <Text style={styles.weekRange}>{getWeekDateRange()}</Text>
          <View style={styles.overviewMain}>
            <View style={styles.overviewStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{report.totalWords}</Text>
                <Text style={styles.statLabel}>本周学词</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{report.studyDays}</Text>
                <Text style={styles.statLabel}>坚持天数</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(report.totalMinutes)}</Text>
                <Text style={styles.statLabel}>学习分钟</Text>
              </View>
            </View>
            <View style={styles.foxMini}>
              <FoxMascot size={60} stage={report.foxStage} mood="proud" />
            </View>
          </View>
          <Text style={styles.overviewMessage}>
            本周学了 <Text style={styles.highlightNumber}>{report.totalWords}</Text> 个词，
            坚持了 <Text style={styles.highlightNumber}>{report.studyDays}</Text> 天
          </Text>
        </View>

        {highlights.length > 0 && (
          <View style={styles.highlightsCard}>
            <Text style={styles.highlightsTitle}>🎉 本周亮点</Text>
            {highlights.map((highlight, index) => (
              <Text key={index} style={styles.highlightText}>{highlight}</Text>
            ))}
          </View>
        )}

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>📈 每日学词</Text>
          <View style={styles.barChart}>
            <View style={styles.barChartInner}>
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                <View key={tick} style={[styles.yAxisLabel, { bottom: tick * (CHART_HEIGHT - 20) + 10 }]}>
                  <Text style={styles.yAxisText}>{Math.round(maxDailyWords * tick)}</Text>
                </View>
              ))}
              <View style={styles.barsContainer}>
                {report.dailyWords.map((count, index) => {
                  const barHeight = count > 0 ? (count / maxDailyWords) * (CHART_HEIGHT - 40) : 0;
                  const isToday = index === new Date().getDay() - 1 || (new Date().getDay() === 0 && index === 6);
                  return (
                    <View key={index} style={styles.barWrapper}>
                      <View style={styles.barInner}>
                        {count > 0 && (
                          <View style={[styles.bar, { height: barHeight, backgroundColor: isToday ? '#4ECDC4' : count > 8 ? '#45B7AA' : '#A8E6CF' }]} />
                        )}
                      </View>
                      <Text style={styles.barLabel}>{WEEK_DAYS[index]}</Text>
                      {count > 0 && <Text style={styles.barValue}>{count}</Text>}
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>🎯 每日正确率</Text>
          <View style={styles.lineChart}>
            <View style={styles.lineChartInner}>
              {[0, 0.5, 1].map((tick) => (
                <View key={tick} style={[styles.lineYLabel, { bottom: tick * (CHART_HEIGHT - 40) + 20 }]}>
                  <Text style={styles.lineYText}>{(tick * 100).toFixed(0)}%</Text>
                </View>
              ))}
              <View style={styles.gridLines}>
                {[0, 0.5, 1].map((tick) => (
                  <View key={tick} style={[styles.gridLine, { bottom: tick * (CHART_HEIGHT - 40) + 20 }]} />
                ))}
              </View>
              <View style={styles.lineDotsContainer}>
                {report.dailyAccuracy.map((accuracy, index) => {
                  if (accuracy === 0) return null;
                  const x = (index + 0.5) * BAR_WIDTH + 30;
                  const y = accuracy * (CHART_HEIGHT - 40) + 20;
                  const isToday = index === new Date().getDay() - 1 || (new Date().getDay() === 0 && index === 6);
                  return <View key={index} style={[styles.lineDot, { left: x - 6, bottom: y - 6, backgroundColor: isToday ? '#4ECDC4' : '#A8E6CF' }]} />;
                })}
              </View>
              <View style={styles.lineLabels}>
                {WEEK_DAYS.map((day, index) => (
                  <Text key={index} style={styles.lineLabel}>{day}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.wordsCard}>
          <Text style={styles.wordsTitle}>🌟 本周掌握的词</Text>
          <View style={styles.wordCloud}>
            {report.masteredWords.map((word, index) => (
              <View key={index} style={styles.wordTag}>
                <Text style={styles.wordTagText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.wordsCard}>
          <Text style={styles.wordsTitle}>📝 可以多练练的词</Text>
          <Text style={styles.wordsSubtitle}>这些词可以平时多复习一下~</Text>
          <View style={styles.wordCloud}>
            {report.strugglingWords.map((word, index) => (
              <View key={index} style={[styles.wordTag, styles.wordTagSecondary]}>
                <Text style={[styles.wordTagText, styles.wordTagTextSecondary]}>{word}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"每一个小小的进步，都是成长的脚步。继续保持~"</Text>
          <Text style={styles.quoteAuthor}>—— 小狐狸</Text>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  backIcon: { fontSize: 28, color: '#4ECDC4' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { flex: 1, paddingHorizontal: 20 },
  overviewCard: { backgroundColor: '#4ECDC4', borderRadius: 20, padding: 20, marginBottom: 16 },
  weekRange: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 16 },
  overviewMain: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overviewStats: { flexDirection: 'row', alignItems: 'center' },
  statItem: { alignItems: 'center', marginHorizontal: 12 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#FFF' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.3)' },
  foxMini: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40, padding: 8 },
  overviewMessage: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 16, textAlign: 'center' },
  highlightNumber: { fontWeight: 'bold', fontSize: 16 },
  highlightsCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  highlightsTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  highlightText: { fontSize: 14, color: '#666', marginBottom: 8, lineHeight: 22 },
  chartCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  barChart: { height: CHART_HEIGHT },
  barChartInner: { flex: 1, position: 'relative' },
  yAxisLabel: { position: 'absolute', left: 0 },
  yAxisText: { fontSize: 10, color: '#999' },
  barsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: CHART_HEIGHT - 30, marginLeft: 30, paddingRight: 10 },
  barWrapper: { alignItems: 'center', width: BAR_WIDTH },
  barInner: { height: CHART_HEIGHT - 40, justifyContent: 'flex-end', width: BAR_WIDTH - 8 },
  bar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4, minHeight: 4 },
  barLabel: { fontSize: 10, color: '#999', marginTop: 4 },
  barValue: { fontSize: 11, color: '#666', fontWeight: '600', marginTop: 2 },
  lineChart: { height: CHART_HEIGHT },
  lineChartInner: { flex: 1, position: 'relative' },
  lineYLabel: { position: 'absolute', left: 0 },
  lineYText: { fontSize: 10, color: '#999' },
  gridLines: { position: 'absolute', left: 30, right: 10, top: 20, bottom: 30 },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#F0F0F0' },
  lineDotsContainer: { position: 'absolute', left: 30, right: 10, top: 20, bottom: 30 },
  lineDot: { position: 'absolute', width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#FFF', shadowColor: '#4ECDC4', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  lineLabels: { position: 'absolute', left: 30, right: 10, bottom: 0, flexDirection: 'row', justifyContent: 'space-between' },
  lineLabel: { fontSize: 10, color: '#999', width: BAR_WIDTH, textAlign: 'center' },
  wordsCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  wordsTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  wordsSubtitle: { fontSize: 13, color: '#999', marginBottom: 12 },
  wordCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordTag: { backgroundColor: '#E8F8F5', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 16 },
  wordTagSecondary: { backgroundColor: '#FFF5F5' },
  wordTagText: { fontSize: 14, color: '#4ECDC4', fontWeight: '500' },
  wordTagTextSecondary: { color: '#FF6B6B' },
  quoteCard: { backgroundColor: '#FFF9E6', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  quoteText: { fontSize: 15, color: '#996600', textAlign: 'center', fontStyle: 'italic', lineHeight: 24 },
  quoteAuthor: { fontSize: 13, color: '#CC9900', marginTop: 12 },
});
