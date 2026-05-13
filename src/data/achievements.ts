import { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first_word',
    name: '第一个词',
    icon: '🌱',
    condition: '学1个词',
    description: '踏出学习的第一步，继续加油！',
  },
  {
    id: 'ten_words',
    name: '初露锋芒',
    icon: '⭐',
    condition: '学10个词',
    description: '已经掌握了10个单词，继续积累！',
  },
  {
    id: 'fifty_words',
    name: '小有成就',
    icon: '🌟',
    condition: '学50个词',
    description: '50个单词收入囊中，厉害了！',
  },
  {
    id: 'hundred_words',
    name: '词林高手',
    icon: '🏅',
    condition: '学100个词',
    description: '百词达成！你已经是词林高手了！',
  },
  {
    id: 'three_days',
    name: '三日坚持',
    icon: '🔥',
    condition: '连续3天',
    description: '连续学习3天，小狐狸为你骄傲！',
  },
  {
    id: 'seven_days',
    name: '一周达人',
    icon: '💪',
    condition: '连续7天',
    description: '坚持一周！学习已经成为习惯~',
  },
  {
    id: 'perfect_level',
    name: '满分通关',
    icon: '💯',
    condition: '一关全对',
    description: '一关全部正确，太棒了！',
  },
  {
    id: 'fox_ears',
    name: '竖起耳朵',
    icon: '🦊',
    condition: '小狐狸进化到阶段2',
    description: '小狐狸长出了竖耳朵！',
  },
  {
    id: 'fox_wings',
    name: '展翅高飞',
    icon: '🦅',
    condition: '小狐狸进化到阶段5',
    description: '小狐狸长出了翅膀，成为了星空天使！',
  },
];

export const getUnlockedAchievements = (unlockedIds: string[]): Achievement[] => {
  return achievements.filter(a => unlockedIds.includes(a.id));
};

export const getLockedAchievements = (unlockedIds: string[]): Achievement[] => {
  return achievements.filter(a => !unlockedIds.includes(a.id));
};
