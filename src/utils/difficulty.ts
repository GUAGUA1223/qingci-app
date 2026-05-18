import { PreschoolWord, PrimaryWord } from '../types';

// 每关词汇数量
export const PRESCHOOL_WORDS_PER_LEVEL = 5;
export const PRIMARY_WORDS_PER_LEVEL = 10;

// 难度范围
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 3;

// 正确率阈值
export const RATE_UP_THRESHOLD = 0.8; // 80%以上升难度
export const RATE_DOWN_THRESHOLD = 0.6; // 60%以下降难度

// 连续错误次数阈值（触发提示）
export const CONTINUOUS_WRONG_THRESHOLD = 3;

// 难度引擎核心逻辑
export class DifficultyEngine {
  private currentDifficulty: number;
  private stage: 'preschool' | 'primary';

  constructor(stage: 'preschool' | 'primary', initialDifficulty: number = 1) {
    this.stage = stage;
    this.currentDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, initialDifficulty));
  }

  // 获取当前难度
  getDifficulty(): number {
    return this.currentDifficulty;
  }

  // 根据正确率调整难度
  adjustDifficulty(correctCount: number, totalCount: number): { 
    newDifficulty: number; 
    silentlyDowngrade: boolean;
    direction: 'up' | 'down' | 'maintain';
  } {
    const correctRate = correctCount / totalCount;
    let direction: 'up' | 'down' | 'maintain' = 'maintain';
    let silentlyDowngrade = false;

    if (correctRate >= RATE_UP_THRESHOLD) {
      const newDifficulty = Math.min(MAX_DIFFICULTY, this.currentDifficulty + 1);
      if (newDifficulty !== this.currentDifficulty) {
        this.currentDifficulty = newDifficulty;
        direction = 'up';
      }
    } else if (correctRate < RATE_DOWN_THRESHOLD) {
      const newDifficulty = Math.max(MIN_DIFFICULTY, this.currentDifficulty - 1);
      if (newDifficulty !== this.currentDifficulty) {
        this.currentDifficulty = newDifficulty;
        silentlyDowngrade = true;
        direction = 'down';
      }
    }

    return {
      newDifficulty: this.currentDifficulty,
      silentlyDowngrade,
      direction,
    };
  }

  getNextLevelDifficulty(): number {
    return this.currentDifficulty;
  }
}

// 从词库中筛选指定难度的词
export function filterWordsByDifficulty<T extends { difficulty?: number }>(
  words: T[],
  difficulty: number,
  count: number
): T[] {
  const matchedWords = words.filter(w => w.difficulty === difficulty);
  
  if (matchedWords.length >= count) {
    return shuffleArray(matchedWords).slice(0, count);
  }
  
  const lowerWords = words.filter(w => 
    w.difficulty !== undefined && 
    w.difficulty < difficulty &&
    !matchedWords.includes(w)
  );
  
  const combined = [...matchedWords, ...lowerWords];
  return shuffleArray(combined).slice(0, count);
}

// 洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 获取学前关卡词汇
export function getPreschoolLevelWords(
  allWords: PreschoolWord[],
  level: number
): PreschoolWord[] {
  const startDifficulty = level === 1 ? 1 : undefined;
  
  if (startDifficulty) {
    const level1Words = allWords.filter(w => w.difficulty === 1);
    return shuffleArray(level1Words).slice(0, PRESCHOOL_WORDS_PER_LEVEL);
  }
  
  const engine = new DifficultyEngine('preschool', 1);
  return filterWordsByDifficulty(allWords, engine.getDifficulty(), PRESCHOOL_WORDS_PER_LEVEL);
}

// 获取小学关卡词汇
export function getPrimaryLevelWords(
  allWords: PrimaryWord[],
  difficulty: number
): PrimaryWord[] {
  return filterWordsByDifficulty(allWords, difficulty, PRIMARY_WORDS_PER_LEVEL);
}

// 判断是否需要显示提示
export function shouldShowHint(wrongStreak: number): boolean {
  return wrongStreak >= CONTINUOUS_WRONG_THRESHOLD;
}

// 计算星星评价
export function calculateStars(correctRate: number): number {
  if (correctRate >= 1) return 3;
  if (correctRate >= 0.8) return 2;
  if (correctRate >= 0.6) return 1;
  return 0;
}

// 生成评价文本
export function getEvaluationText(stars: number): string {
  switch (stars) {
    case 3: return '太棒了！完美通关！';
    case 2: return '很不错！继续加油！';
    case 1: return '做得很好！';
    default: return '继续努力！';
  }
}
