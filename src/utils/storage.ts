import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stage } from '../types';

const KEYS = {
  USER_STAGE: 'user_stage',
  USER_PROGRESS: 'user_progress',
  PRESCHOOL_INDEX: 'preschool_index',
  PRIMARY_INDEX: 'primary_index',
  MIDDLE_INDEX: 'middle_index',
  HIGH_INDEX: 'high_index',
  MASTERED_WORDS: 'mastered_words',
};

export async function saveUserStage(stage: Stage): Promise<void> {
  await AsyncStorage.setItem(KEYS.USER_STAGE, stage);
}

export async function getUserStage(): Promise<Stage | null> {
  const stage = await AsyncStorage.getItem(KEYS.USER_STAGE);
  return stage as Stage | null;
}

export async function saveProgress(stage: Stage, index: number): Promise<void> {
  const keyMap: Record<Stage, string> = {
    preschool: KEYS.PRESCHOOL_INDEX,
    primary: KEYS.PRIMARY_INDEX,
    middle: KEYS.MIDDLE_INDEX,
    high: KEYS.HIGH_INDEX,
  };
  await AsyncStorage.setItem(keyMap[stage], index.toString());
}

export async function getProgress(stage: Stage): Promise<number> {
  const keyMap: Record<Stage, string> = {
    preschool: KEYS.PRESCHOOL_INDEX,
    primary: KEYS.PRIMARY_INDEX,
    middle: KEYS.MIDDLE_INDEX,
    high: KEYS.HIGH_INDEX,
  };
  const value = await AsyncStorage.getItem(keyMap[stage]);
  return value ? parseInt(value, 10) : 0;
}

export async function addMasteredWord(stage: Stage, word: string): Promise<void> {
  const key = `${KEYS.MASTERED_WORDS}_${stage}`;
  const existing = await AsyncStorage.getItem(key);
  const words: string[] = existing ? JSON.parse(existing) : [];
  if (!words.includes(word)) {
    words.push(word);
    await AsyncStorage.setItem(key, JSON.stringify(words));
  }
}

export async function getMasteredWords(stage: Stage): Promise<string[]> {
  const key = `${KEYS.MASTERED_WORDS}_${stage}`;
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : [];
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.clear();
}
