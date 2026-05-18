// SM-2 间隔重复算法实现
// 基于 SuperMemo 2 算法

import { ReviewRecord, ReviewQuality, Stage } from '../types/vocabulary';

const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const INITIAL_INTERVAL = 1;

export interface SM2Result {
  repetitions: number;
  easeFactor: number;
  interval: number;
  nextReview: string;
}

export function calculateSM2(
  quality: ReviewQuality,
  currentRecord: ReviewRecord | null
): SM2Result {
  let repetitions: number;
  let easeFactor: number;
  let interval: number;

  if (!currentRecord) {
    repetitions = 0;
    easeFactor = DEFAULT_EASE_FACTOR;
    interval = INITIAL_INTERVAL;
  } else {
    repetitions = currentRecord.repetitions;
    easeFactor = currentRecord.easeFactor;
    interval = currentRecord.interval;
  }

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  if (quality === 5) {
    easeFactor = easeFactor + 0.15;
  } else if (quality === 3) {
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    repetitions,
    easeFactor,
    interval,
    nextReview: nextReview.toISOString(),
  };
}

export function createReviewRecord(
  wordId: string,
  stage: Stage,
  textbookId?: string,
  unitId?: string
): ReviewRecord {
  const now = new Date().toISOString();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    wordId,
    repetitions: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: INITIAL_INTERVAL,
    nextReview: tomorrow.toISOString(),
    lastReview: now,
    stage,
    textbookId,
    unitId,
  };
}

export function isDueForReview(record: ReviewRecord): boolean {
  const now = new Date();
  const nextReview = new Date(record.nextReview);
  return now >= nextReview;
}

export function getWordsForReview(records: ReviewRecord[]): ReviewRecord[] {
  return records.filter(isDueForReview);
}

export function getQualityDescription(quality: ReviewQuality): string {
  const descriptions: Record<ReviewQuality, string> = {
    0: '不记得',
    1: '很模糊',
    2: '模糊',
    3: '勉强记得',
    4: '记得',
    5: '很轻松',
  };
  return descriptions[quality];
}

export function getQualityEmoji(quality: ReviewQuality): string {
  const emojis: Record<ReviewQuality, string> = {
    0: '😵',
    1: '😕',
    2: '🤔',
    3: '😐',
    4: '😊',
    5: '🤩',
  };
  return emojis[quality];
}
