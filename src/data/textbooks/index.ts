// 课本数据汇总导出
import { Textbook, TextbookCatalogItem, VocabWord, Unit, Stage } from '../../types/vocabulary';

// 导入所有课本
// 小学（PEP版）
import { pep3a } from './primary/pep-3a';
import { pep3b } from './primary/pep-3b';
import { pep4a } from './primary/pep-4a';
import { pep4b } from './primary/pep-4b';
import { pep5a } from './primary/pep-5a';
import { pep5b } from './primary/pep-5b';
import { pep6a } from './primary/pep-6a';
import { pep6b } from './primary/pep-6b';

// 初中（新目标Go for it!）
import { pep7a } from './middle/pep-7a';
import { pep7b } from './middle/pep-7b';
import { pep8a } from './middle/pep-8a';
import { pep8b } from './middle/pep-8b';
import { pep9 } from './middle/pep-9';

// 高中（人教新课标必修）
import { pepCompulsory1 } from './high/pep-compulsory1';
import { pepCompulsory2 } from './high/pep-compulsory2';
import { pepCompulsory3 } from './high/pep-compulsory3';

// 课本目录（轻量级列表）
export const TEXTBOOK_CATALOG: TextbookCatalogItem[] = [
  // 小学三年级
  { id: 'pep-primary-3a', name: '人教PEP三年级上册', publisher: '人教PEP', grade: 3, semester: 'first', stage: 'primary' },
  { id: 'pep-primary-3b', name: '人教PEP三年级下册', publisher: '人教PEP', grade: 3, semester: 'second', stage: 'primary' },
  // 小学四年级
  { id: 'pep-primary-4a', name: '人教PEP四年级上册', publisher: '人教PEP', grade: 4, semester: 'first', stage: 'primary' },
  { id: 'pep-primary-4b', name: '人教PEP四年级下册', publisher: '人教PEP', grade: 4, semester: 'second', stage: 'primary' },
  // 小学五年级
  { id: 'pep-primary-5a', name: '人教PEP五年级上册', publisher: '人教PEP', grade: 5, semester: 'first', stage: 'primary' },
  { id: 'pep-primary-5b', name: '人教PEP五年级下册', publisher: '人教PEP', grade: 5, semester: 'second', stage: 'primary' },
  // 小学六年级（小升初）
  { id: 'pep-primary-6a', name: '人教PEP六年级上册', publisher: '人教PEP', grade: 6, semester: 'first', stage: 'primary' },
  { id: 'pep-primary-6b', name: '人教PEP六年级下册', publisher: '人教PEP', grade: 6, semester: 'second', stage: 'primary' },
  // 初一
  { id: 'pep-middle-7a', name: '人教新目标七年级上册', publisher: '人教新目标', grade: 7, semester: 'first', stage: 'middle' },
  { id: 'pep-middle-7b', name: '人教新目标七年级下册', publisher: '人教新目标', grade: 7, semester: 'second', stage: 'middle' },
  // 初二
  { id: 'pep-middle-8a', name: '人教新目标八年级上册', publisher: '人教新目标', grade: 8, semester: 'first', stage: 'middle' },
  { id: 'pep-middle-8b', name: '人教新目标八年级下册', publisher: '人教新目标', grade: 8, semester: 'second', stage: 'middle' },
  // 初三
  { id: 'pep-middle-9', name: '人教新目标九年级全一册', publisher: '人教新目标', grade: 9, semester: 'first', stage: 'middle' },
  // 高一
  { id: 'pep-high-compulsory1', name: '人教新课标必修第一册', publisher: '人教新课标', grade: 10, semester: 'first', stage: 'high' },
  { id: 'pep-high-compulsory2', name: '人教新课标必修第二册', publisher: '人教新课标', grade: 10, semester: 'second', stage: 'high' },
  // 高二
  { id: 'pep-high-compulsory3', name: '人教新课标必修第三册', publisher: '人教新课标', grade: 11, semester: 'first', stage: 'high' },
];

// 所有课本数据
const ALL_TEXTBOOKS: Record<string, Textbook> = {
  // 小学
  'pep-primary-3a': pep3a,
  'pep-primary-3b': pep3b,
  'pep-primary-4a': pep4a,
  'pep-primary-4b': pep4b,
  'pep-primary-5a': pep5a,
  'pep-primary-5b': pep5b,
  'pep-primary-6a': pep6a,
  'pep-primary-6b': pep6b,
  // 初中
  'pep-middle-7a': pep7a,
  'pep-middle-7b': pep7b,
  'pep-middle-8a': pep8a,
  'pep-middle-8b': pep8b,
  'pep-middle-9': pep9,
  // 高中
  'pep-high-compulsory1': pepCompulsory1,
  'pep-high-compulsory2': pepCompulsory2,
  'pep-high-compulsory3': pepCompulsory3,
};

/**
 * 获取课本
 */
export function getTextbook(id: string): Textbook | undefined {
  return ALL_TEXTBOOKS[id];
}

/**
 * 按学段和年级获取课本
 */
export function getTextbooksByGrade(stage: Stage, grade: number): Textbook[] {
  return Object.values(ALL_TEXTBOOKS).filter(
    (t) => t.stage === stage && t.grade === grade
  );
}

/**
 * 按学段获取所有课本
 */
export function getTextbooksByStage(stage: Stage): Textbook[] {
  return Object.values(ALL_TEXTBOOKS).filter((t) => t.stage === stage);
}

/**
 * 获取课本的所有单元
 */
export function getUnits(textbookId: string): Unit[] {
  const textbook = getTextbook(textbookId);
  return textbook?.units || [];
}

/**
 * 获取单元的所有词汇
 */
export function getWordsByUnit(textbookId: string, unitId: string): VocabWord[] {
  const textbook = getTextbook(textbookId);
  const unit = textbook?.units.find((u) => u.id === unitId);
  return unit?.words || [];
}

/**
 * 获取课本的词汇总数
 */
export function getWordCount(textbookId: string): number {
  const textbook = getTextbook(textbookId);
  if (!textbook) return 0;
  return textbook.units.reduce((sum, unit) => sum + unit.words.length, 0);
}

/**
 * 获取单元的词汇数
 */
export function getUnitWordCount(textbookId: string, unitId: string): number {
  return getWordsByUnit(textbookId, unitId).length;
}

/**
 * 按学段获取课本目录
 */
export function getCatalogByStage(stage: Stage): TextbookCatalogItem[] {
  return TEXTBOOK_CATALOG.filter((t) => t.stage === stage);
}

/**
 * 获取所有课本ID列表
 */
export function getAllTextbookIds(): string[] {
  return TEXTBOOK_CATALOG.map((t) => t.id);
}

/**
 * 检查课本是否存在
 */
export function textbookExists(id: string): boolean {
  return id in ALL_TEXTBOOKS;
}

/**
 * 根据词汇ID查找词汇
 */
export function findWordById(wordId: string): { textbook: Textbook; unit: Unit; word: VocabWord } | undefined {
  for (const textbook of Object.values(ALL_TEXTBOOKS)) {
    for (const unit of textbook.units) {
      const word = unit.words.find((w) => w.id === wordId);
      if (word) {
        return { textbook, unit, word };
      }
    }
  }
  return undefined;
}

/**
 * 获取所有词汇
 */
export function getAllWords(textbookId: string): VocabWord[] {
  const textbook = getTextbook(textbookId);
  if (!textbook) return [];
  return textbook.units.flatMap((unit) => unit.words);
}
