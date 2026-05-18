import { WeeklyReport } from '../types';

export const mockWeeklyReport: WeeklyReport = {
  weekStart: getWeekStart(),
  totalWords: 51,
  totalMinutes: 127,
  studyDays: 6,
  dailyWords: [8, 10, 7, 0, 9, 12, 5],
  dailyAccuracy: [0.8, 0.9, 0.7, 0, 0.85, 0.95, 0.75],
  masteredWords: ['apple', 'cat', 'school', 'book', 'water', 'happy', 'friend', 'family', 'teacher', 'learn', 'study', 'pencil', 'classroom', 'breakfast', 'beautiful'],
  strugglingWords: ['beautiful', 'different', 'important', 'because', 'remember'],
  streakDays: 12,
  foxStage: 2,
};

function getWeekStart(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export const generateHighlights = (report: WeeklyReport): string[] => {
  const highlights: string[] = [];
  if (report.streakDays >= 7) highlights.push(`🔥 连续学习${report.streakDays}天！太棒了！`);
  if (report.studyDays >= 5) highlights.push(`✨ 本周学习了${report.studyDays}天，坚持就是胜利！`);
  const avgAccuracy = report.dailyAccuracy.filter(a => a > 0).reduce((sum, a, _, arr) => sum + a / arr.length, 0);
  if (avgAccuracy >= 0.85) highlights.push(`🎯 平均正确率${(avgAccuracy * 100).toFixed(0)}%，表现优秀！`);
  if (report.totalMinutes >= 120) highlights.push(`⏰ 本周学习${Math.round(report.totalMinutes / 60)}小时，继续保持！`);
  if (report.masteredWords.length >= 10) highlights.push(`📚 本周掌握${report.masteredWords.length}个新单词！`);
  return highlights;
};

export const ACHIEVEMENTS_LIST = [
  { id: 'first_day', name: '第一天', icon: '🌱', description: '完成第一次学习', category: 'learning' },
  { id: 'week_streak', name: '一周坚持', icon: '🔥', description: '连续学习7天', category: 'streak' },
  { id: 'month_streak', name: '月度达人', icon: '🏆', description: '连续学习30天', category: 'streak' },
  { id: 'word_master_50', name: '词汇新星', icon: '⭐', description: '掌握50个单词', category: 'learning' },
  { id: 'word_master_100', name: '词汇达人', icon: '🌟', description: '掌握100个单词', category: 'learning' },
  { id: 'word_master_500', name: '词汇大师', icon: '💎', description: '掌握500个单词', category: 'learning' },
  { id: 'perfect_day', name: '完美一天', icon: '💯', description: '一天学习正确率100%', category: 'challenge' },
  { id: 'early_bird', name: '早起鸟', icon: '🐦', description: '早晨学习', category: 'special' },
  { id: 'night_owl', name: '夜猫子', icon: '🦉', description: '晚上学习', category: 'special' },
  { id: 'fox_evolution', name: '狐狸进化', icon: '🦊', description: '小狐狸进化到新阶段', category: 'special' },
];
