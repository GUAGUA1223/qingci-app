// 成就徽章数据 - 使用图片资源
import { badgeImages } from '../../assets/images';

export interface Achievement {
  id: string;
  name: string;
  icon: any; // Image source
  description: string;
  condition: (stats: { totalWords: number; consecutiveDays: number; perfectLevels: number }) => boolean;
  category: 'learning' | 'streak' | 'challenge' | 'special';
}

export const achievements: Achievement[] = [
  { 
    id: 'first_word', name: '第一个词', icon: badgeImages.first_word, 
    description: '完成第一个单词的学习', condition: (stats) => stats.totalWords >= 1, category: 'learning' 
  },
  { 
    id: 'ten_words', name: '初露锋芒', icon: badgeImages.ten_words, 
    description: '累计学习10个单词', condition: (stats) => stats.totalWords >= 10, category: 'learning' 
  },
  { 
    id: 'fifty_words', name: '小有成就', icon: badgeImages.fifty_words, 
    description: '累计学习50个单词', condition: (stats) => stats.totalWords >= 50, category: 'learning' 
  },
  { 
    id: 'hundred_words', name: '词林高手', icon: badgeImages.hundred_words, 
    description: '累计学习100个单词', condition: (stats) => stats.totalWords >= 100, category: 'learning' 
  },
  { 
    id: 'three_day_streak', name: '三日坚持', icon: badgeImages.three_days, 
    description: '连续学习3天', condition: (stats) => stats.consecutiveDays >= 3, category: 'streak' 
  },
  { 
    id: 'one_week_streak', name: '一周达人', icon: badgeImages.seven_days, 
    description: '连续学习7天', condition: (stats) => stats.consecutiveDays >= 7, category: 'streak' 
  },
  { 
    id: 'perfect_clear', name: '满分通关', icon: badgeImages.perfect, 
    description: '完成一关且全部正确', condition: (stats) => stats.perfectLevels >= 1, category: 'challenge' 
  },
  { 
    id: 'fox_ear', name: '竖起耳朵', icon: badgeImages.fox_ears, 
    description: '小狐狸解锁第二阶段', condition: (stats) => stats.consecutiveDays >= 3, category: 'special' 
  },
  { 
    id: 'fox_wing', name: '展翅高飞', icon: badgeImages.fox_wings, 
    description: '小狐狸解锁最终阶段', condition: (stats) => stats.consecutiveDays >= 66, category: 'special' 
  },
];

export const getAllAchievements = () => achievements;

export const checkAchievement = (achievementId: string, stats: any): boolean => {
  const achievement = achievements.find(a => a.id === achievementId);
  return achievement ? achievement.condition(stats) : false;
};

export const getUnlockedAchievements = (stats: any, alreadyUnlocked: string[]): string[] => {
  return achievements.filter(a => !alreadyUnlocked.includes(a.id) && a.condition(stats)).map(a => a.id);
};
