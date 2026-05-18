export type Stage = 'preschool' | 'primary' | 'middle' | 'high';

export interface PreschoolWord {
  word: string;
  meaning: string;
  image: string;
  difficulty: number;
}

export interface PrimaryWord {
  word: string;
  phonetic: string;
  meaning: string;
  sentence: string;
  memoryTip?: string;
  image: string;
  difficulty?: number;
}

export interface MiddleWord {
  word: string;
  phonetic: string;
  meaning: string;
  sentence: string;
  memoryTip: string;
  image?: string;
  examFreq: number;
  partOfSpeech: string;
  difficulty: number;
}

export interface HighWord extends MiddleWord {
  synonyms: string[];
  antonyms: string[];
}

export interface UserProgress {
  stage: Stage;
  currentIndex: number;
  totalLearned: number;
  masteredWords: string[];
  lastStudyDate: string;
}

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LevelConfig {
  stage: Stage;
  level: number;
  difficulty: number;
  wordsCompleted: number;
  correctCount: number;
  wrongCount: number;
}

export interface StudyStats {
  totalWordsLearned: number;
  totalLevelsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
}

export interface FoxState {
  stage: number;
  name: string;
  consecutiveDays: number;
  totalWords: number;
  mood: 'happy' | 'sleepy' | 'hungry' | 'proud' | 'excited';
  accessories: string[];
  lastStudyDate: string;
  unlockedAchievements: string[];
}

export interface AchievementDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'learning' | 'streak' | 'challenge' | 'special';
}

// Weekly Report Types
export interface WeeklyReport {
  weekStart: string;
  totalWords: number;
  totalMinutes: number;
  studyDays: number;
  dailyWords: number[];
  dailyAccuracy: number[];
  masteredWords: string[];
  strugglingWords: string[];
  streakDays: number;
  foxStage: number;
}

// Parent Settings Types
export interface ParentSettings {
  dailyLimitMinutes: number;
  weeklyStudyDays: number;
  restDays: number[];
  gentleReminderEnabled: boolean;
  customReminderText?: string;
}

// Parent PIN Types
export interface ParentPinState {
  pin: string;
  isVerified: boolean;
  lastVerified?: string;
}
