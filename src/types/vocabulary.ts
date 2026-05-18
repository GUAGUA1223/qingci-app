// 课本同步词库类型定义

// 学段类型
export type Stage = 'preschool' | 'primary' | 'middle' | 'high';

// 学期类型
export type Semester = 'first' | 'second';

// 课本结构
export interface Textbook {
  id: string;
  name: string;
  publisher: string;
  stage: Stage;
  grade: number;
  semester: Semester;
  units: Unit[];
}

// 单元结构
export interface Unit {
  id: string;
  name: string;
  words: VocabWord[];
}

// 词汇（统一格式）
export interface VocabWord {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  sentence: string;
  memoryTip?: string;
  image: string;
  difficulty: number;
  partOfSpeech: string;
  examFreq?: number;
  synonyms?: string[];
  antonyms?: string[];
}

// 课本目录项（轻量级）
export interface TextbookCatalogItem {
  id: string;
  name: string;
  publisher: string;
  grade: number;
  semester: Semester;
  stage: Stage;
}

// 复习记录
export interface ReviewRecord {
  wordId: string;
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: string;
  lastReview: string;
  stage: Stage;
  textbookId?: string;
  unitId?: string;
}

// 复习质量评分
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;
