import { PreschoolWord } from '../types';

export const PRESCHOOL_WORDS_PER_LEVEL = 10;
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 4;

export function filterWordsByDifficulty(
  words: PreschoolWord[],
  difficulty: number,
  limit: number
): PreschoolWord[] {
  const filtered = words.filter(w => w.difficulty === difficulty);
  return filtered.slice(0, limit);
}

export function calculateStars(correctRate: number): number {
  if (correctRate >= 0.9) return 3;
  if (correctRate >= 0.7) return 2;
  if (correctRate >= 0.5) return 1;
  return 0;
}

export function shouldShowHint(wrongStreak: number): boolean {
  return wrongStreak >= 2;
}

export class DifficultyEngine {
  private currentDifficulty: number;
  private stage: string;
  private correctCount = 0;
  private totalCount = 0;

  constructor(stage: string, initialDifficulty: number) {
    this.stage = stage;
    this.currentDifficulty = initialDifficulty;
  }

  getDifficulty(): number {
    return this.currentDifficulty;
  }

  adjustDifficulty(correct: number, total: number): void {
    this.correctCount += correct;
    this.totalCount += total;
    const rate = correct / total;
    if (rate >= 0.9 && this.currentDifficulty < MAX_DIFFICULTY) {
      this.currentDifficulty += 1;
    } else if (rate < 0.4 && this.currentDifficulty > MIN_DIFFICULTY) {
      this.currentDifficulty -= 1;
    }
    this.correctCount = 0;
    this.totalCount = 0;
  }
}
