// 学段类型
export type Stage = 'preschool' | 'primary' | 'middle' | 'high';

// 小狐狸心情类型
export type FoxMood = 'happy' | 'sleepy' | 'hungry' | 'proud' | 'excited';

// 小狐狸阶段
export type FoxStage = 0 | 1 | 2 | 3 | 4;

// 小狐狸状态
export interface FoxState {
  stage: FoxStage;
  name: string;
  consecutiveDays: number;
  totalWords: number;
  mood: FoxMood;
  accessories: string[];
  lastStudyDate: string;
  currentStreak: number;
  longestStreak: number;
  masteredWords: string[];
  unlockedAchievements: string[];
}

// 小狐狸动作
export type FoxAction =
  | { type: 'STUDY_WORD'; payload: { wordId: string } }
  | { type: 'COMPLETE_LEVEL'; payload: { correctCount: number; totalCount: number } }
  | { type: 'UPDATE_STREAK' }
  | { type: 'CHANGE_NAME'; payload: { name: string } }
  | { type: 'ADD_ACCESSORY'; payload: { accessory: string } }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: { achievementId: string } }
  | { type: 'LOAD_STATE'; payload: FoxState };

// 学前单词
export interface PreschoolWord {
  word: string;
  meaning: string;
  image: string;
  difficulty: number;
}

// 小学单词
export interface PrimaryWord {
  word: string;
  phonetic: string;
  meaning: string;
  sentence: string;
  memoryTip?: string;
  image: string;
  difficulty?: number;
}

// 初中单词
export interface MiddleWord extends PrimaryWord {
  examFreq: number;
  partOfSpeech: string;
  difficulty: number;
}

// 高中单词
export interface HighWord extends MiddleWord {
  synonyms: string[];
  antonyms: string[];
}

// 成就
export interface Achievement {
  id: string;
  name: string;
  icon: string;
  condition: string;
  description: string;
}

// 用户进度
export interface UserProgress {
  stage: Stage;
  currentIndex: number;
  totalLearned: number;
  masteredWords: string[];
  lastStudyDate: string;
}

// 关卡配置
export interface LevelConfig {
  stage: Stage;
  level: number;
  difficulty: number;
  wordsCompleted: number;
  correctCount: number;
  wrongCount: number;
}

// 学习统计
export interface StudyStats {
  totalWordsLearned: number;
  totalLevelsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
}

// 选词结果
export interface WordSelection {
  correct: boolean;
  selectedIndex: number;
  correctIndex: number;
}

// 学习模式
export type StudyMode = 'flashcard' | 'quiz';

// 初中关卡状态
export interface MiddleLevelState {
  currentWordIndex: number;
  words: MiddleWord[];
  correctCount: number;
  wrongCount: number;
  mode: StudyMode;
  isFlipped: boolean;
  isCompleted: boolean;
  startTime: number;
}

// 高中关卡状态
export interface HighLevelState {
  currentWordIndex: number;
  words: HighWord[];
  correctCount: number;
  wrongCount: number;
  mode: 'speed' | 'challenge';
  isFlipped: boolean;
  isCompleted: boolean;
  startTime: number;
  knownWords: string[];
  unknownWords: string[];
}

// ==================== 课本词库类型 ====================

// 单词
export interface TextbookWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  difficulty: number;
}

// 单元
export interface TextbookUnit {
  id: string;
  name: string;
  description: string;
  order: number;
  words: TextbookWord[];
}

// 课本
export interface Textbook {
  id: string;
  name: string;
  publisher: string;
  grade: number;
  semester: string;
  subject: string;
  units: TextbookUnit[];
}
