import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useParentSettings } from '../../src/store/parentStore';
import { colors } from '../../src/theme/colors';

const DAILY_OPTIONS = [10, 15, 20, 25, 30];
const WEEKLY_OPTIONS = [3, 4, 5, 6, 7];
const REST_DAY_OPTIONS = [
  { value: 0, label: '周日' },
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
];

export default function TimeLimitPage() {
  const router = useRouter();
  const {
    settings,
    updateDailyLimit,
    updateWeeklyDays,
    updateRestDays,
    toggleGentleReminder,
  } = useParentSettings();

  const toggleRestDay = (day: number) => {
    const newRestDays = settings.restDays.includes(day)
      ? settings.restDays.filter(d => d !== day)
      : [...settings.restDays, day];
    updateRestDays(newRestDays);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>⏰ 学习时间管理</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📱 每日学习时长上限</Text>
            <Text style={styles.currentValue}>{settings.dailyLimitMinutes} 分钟</Text>
          </View>
          <Text style={styles.cardDescription}>
            达到设定时间后，小狐狸会温柔地提醒休息~
          </Text>
          <View style={styles.presetContainer}>
            {DAILY_OPTIONS.map((mins) => (
              <TouchableOpacity
                key={mins}
                style={[
                  styles.presetButton,
                  settings.dailyLimitMinutes === mins && styles.presetButtonActive,
                ]}
                onPress={() => updateDailyLimit(mins)}
              >
                <Text
                  style={[
                    styles.presetText,
                    settings.dailyLimitMinutes === mins && styles.presetTextActive,
                  ]}
                >
                  {mins}分
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📅 每周学习天数建议</Text>
            <Text style={styles.currentValue}>{settings.weeklyStudyDays} 天</Text>
          </View>
          <Text style={styles.cardDescription}>
            建议每周学习的天数，保护孩子的学习节奏
          </Text>
          <View style={styles.weekGrid}>
            {WEEKLY_OPTIONS.map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.weekButton,
                  settings.weeklyStudyDays === days && styles.weekButtonActive,
                ]}
                onPress={() => updateWeeklyDays(days)}
              >
                <Text
                  style={[
                    styles.weekText,
                    settings.weeklyStudyDays === days && styles.weekTextActive,
                  ]}
                >
                  {days}
                </Text>
                <Text
                  style={[
                    styles.weekLabel,
                    settings.weeklyStudyDays === days && styles.weekLabelActive,
                  ]}
                >
                  天
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>🌙 休息日设置</Text>
          </View>
          <Text style={styles.cardDescription}>
            选择不提醒学习的日子，让孩子充分休息
          </Text>
          <View style={styles.restDaysGrid}>
            {REST_DAY_OPTIONS.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.restDayButton,
                  settings.restDays.includes(day.value) && styles.restDayButtonActive,
                ]}
                onPress={() => toggleRestDay(day.value)}
              >
                <Text
                  style={[
                    styles.restDayText,
                    settings.restDays.includes(day.value) && styles.restDayTextActive,
                  ]}
                >
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>💬 温柔提醒</Text>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                settings.gentleReminderEnabled && styles.toggleButtonActive,
              ]}
              onPress={() => toggleGentleReminder(!settings.gentleReminderEnabled)}
            >
              <View
                style={[
                  styles.toggleThumb,
                  settings.gentleReminderEnabled && styles.toggleThumbActive,
                ]}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.cardDescription}>
            到达上限后，使用温和的鼓励语代替生硬的提示
          </Text>
          {settings.gentleReminderEnabled && (
            <View style={styles.reminderExamples}>
              <Text style={styles.reminderExample}>✨ "今天学得很棒啦！休息一下吧~"</Text>
              <Text style={styles.reminderExample}>✨ "今天表现很优秀，休息一下再继续吧~"</Text>
              <Text style={styles.reminderExample}>✨ "学习时间到啦，休息一下眼睛吧~"</Text>
            </View>
          )}
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 小贴士</Text>
          <Text style={styles.tipText}>
            适度的学习时间和休息是保持学习兴趣的关键。建议每天学习时长控制在15-25分钟，每周休息1-2天效果最佳。
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backIcon: {
    fontSize: 28,
    color: '#4ECDC4',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currentValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  cardDescription: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
    lineHeight: 20,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  presetText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  presetTextActive: {
    color: '#FFF',
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  weekButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    alignItems: 'center',
  },
  weekButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  weekText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  weekTextActive: {
    color: '#FFF',
  },
  weekLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  weekLabelActive: {
    color: '#FFF',
  },
  restDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  restDayButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  restDayButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  restDayText: {
    fontSize: 14,
    color: '#666',
  },
  restDayTextActive: {
    color: '#FFF',
  },
  toggleButton: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  reminderExamples: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  reminderExample: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  tipCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD93D',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#996600',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#996600',
    lineHeight: 22,
  },
});
