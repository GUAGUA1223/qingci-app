// 课本词库索引
import { Textbook, Stage } from '../../types';

// 导入所有课本
// 小学课本
import pep_3a from './primary/pep-3a';
import pep_3b from './primary/pep-3b';
import pep_4a from './primary/pep-4a';
import pep_4b from './primary/pep-4b';
import pep_5a from './primary/pep-5a';
import pep_5b from './primary/pep-5b';
import pep_6a from './primary/pep-6a';
import pep_6b from './primary/pep-6b';

// 初中课本
import pep_7a from './middle/pep-7a';
import pep_7b from './middle/pep-7b';
import pep_8a from './middle/pep-8a';
import pep_8b from './middle/pep-8b';
import pep_9 from './middle/pep-9';

// 高中课本
import pep_compulsory1 from './high/pep-compulsory1';
import pep_compulsory2 from './high/pep-compulsory2';
import pep_compulsory3 from './high/pep-compulsory3';

// 所有课本列表
export const ALL_TEXTBOOKS: Textbook[] = [
  // 小学 (3-6年级)
  pep_3a,
  pep_3b,
  pep_4a,
  pep_4b,
  pep_5a,
  pep_5b,
  pep_6a,
  pep_6b,
  // 初中 (7-9年级)
  pep_7a,
  pep_7b,
  pep_8a,
  pep_8b,
  pep_9,
  // 高中 (10年级)
  pep_compulsory1,
  pep_compulsory2,
  pep_compulsory3,
];

// 按ID获取课本
export const getTextbookById = (id: string): Textbook | undefined => {
  return ALL_TEXTBOOKS.find(book => book.id === id);
};

// 按年级获取课本
export const getTextbooksByGrade = (grade: number): Textbook[] => {
  return ALL_TEXTBOOKS.filter(book => book.grade === grade);
};

// 按学期获取课本
export const getTextbooksBySemester = (semester: string): Textbook[] => {
  return ALL_TEXTBOOKS.filter(book => book.semester === semester);
};

// 按学段获取课本
export const getTextbooksByStage = (stage: Stage): Textbook[] => {
  switch (stage) {
    case 'primary':
      return getPrimaryTextbooks();
    case 'middle':
      return getMiddleTextbooks();
    case 'high':
      return getHighTextbooks();
    default:
      return [];
  }
};

// 获取小学课本
export const getPrimaryTextbooks = (): Textbook[] => {
  return ALL_TEXTBOOKS.filter(book => book.grade >= 3 && book.grade <= 6);
};

// 获取初中课本
export const getMiddleTextbooks = (): Textbook[] => {
  return ALL_TEXTBOOKS.filter(book => book.grade >= 7 && book.grade <= 9);
};

// 获取高中课本
export const getHighTextbooks = (): Textbook[] => {
  return ALL_TEXTBOOKS.filter(book => book.grade >= 10);
};

// 获取所有年级
export const getAllGrades = (): number[] => {
  return [...new Set(ALL_TEXTBOOKS.map(book => book.grade))].sort();
};

// 获取所有单元
export const getAllUnits = (textbookId: string) => {
  const textbook = getTextbookById(textbookId);
  return textbook?.units || [];
};

// 获取所有单词
export const getAllWords = (textbookId: string) => {
  const textbook = getTextbookById(textbookId);
  if (!textbook) return [];
  return textbook.units.flatMap(unit => unit.words);
};

// 获取指定单元的单词
export const getWordsByUnit = (textbookId: string, unitId: string) => {
  const textbook = getTextbookById(textbookId);
  if (!textbook) return [];
  const unit = textbook.units.find(u => u.id === unitId);
  return unit?.words || [];
};

// 获取词库统计信息
export const getTextbookStats = () => {
  const stats = {
    totalTextbooks: ALL_TEXTBOOKS.length,
    totalWords: 0,
    byStage: {
      primary: { textbooks: 0, words: 0 },
      middle: { textbooks: 0, words: 0 },
      high: { textbooks: 0, words: 0 },
    },
  };

  ALL_TEXTBOOKS.forEach(book => {
    const wordCount = book.units.reduce((sum, unit) => sum + unit.words.length, 0);
    stats.totalWords += wordCount;

    if (book.grade >= 3 && book.grade <= 6) {
      stats.byStage.primary.textbooks++;
      stats.byStage.primary.words += wordCount;
    } else if (book.grade >= 7 && book.grade <= 9) {
      stats.byStage.middle.textbooks++;
      stats.byStage.middle.words += wordCount;
    } else if (book.grade >= 10) {
      stats.byStage.high.textbooks++;
      stats.byStage.high.words += wordCount;
    }
  });

  return stats;
};
