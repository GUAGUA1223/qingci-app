// 复习状态管理 Store
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ReviewRecord, ReviewQuality, Stage } from '../types/vocabulary';
import { calculateSM2, createReviewRecord, getWordsForReview } from '../utils/spacedRepetition';

const REVIEW_STORAGE_KEY = '@qingci_review_records';

interface ReviewState {
  records: Record<string, ReviewRecord>;
  isLoading: boolean;
  isInitialized: boolean;
}

type ReviewAction =
  | { type: 'INIT_RECORDS'; payload: Record<string, ReviewRecord> }
  | { type: 'ADD_WORD'; payload: ReviewRecord }
  | { type: 'ADD_WORDS'; payload: ReviewRecord[] }
  | { type: 'UPDATE_REVIEW'; payload: { wordId: string; quality: ReviewQuality } }
  | { type: 'REMOVE_WORD'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: ReviewState = {
  records: {},
  isLoading: true,
  isInitialized: false,
};

function reviewReducer(state: ReviewState, action: ReviewAction): ReviewState {
  switch (action.type) {
    case 'INIT_RECORDS':
      return { ...state, records: action.payload, isLoading: false, isInitialized: true };
    case 'ADD_WORD':
      return { ...state, records: { ...state.records, [action.payload.wordId]: action.payload } };
    case 'ADD_WORDS': {
      const newRecords = { ...state.records };
      action.payload.forEach((record) => { newRecords[record.wordId] = record; });
      return { ...state, records: newRecords };
    }
    case 'UPDATE_REVIEW': {
      const { wordId, quality } = action.payload;
      const currentRecord = state.records[wordId];
      if (!currentRecord) return state;
      const result = calculateSM2(quality, currentRecord);
      return {
        ...state,
        records: {
          ...state.records,
          [wordId]: { ...currentRecord, repetitions: result.repetitions, easeFactor: result.easeFactor, interval: result.interval, nextReview: result.nextReview, lastReview: new Date().toISOString() },
        },
      };
    }
    case 'REMOVE_WORD': {
      const newRecords = { ...state.records };
      delete newRecords[action.payload];
      return { ...state, records: newRecords };
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface ReviewContextValue extends ReviewState {
  addWordToReview: (wordId: string, stage: Stage, textbookId?: string, unitId?: string) => void;
  addWordsToReview: (words: Array<{ wordId: string; stage: Stage; textbookId?: string; unitId?: string }>) => void;
  reviewWord: (wordId: string, quality: ReviewQuality) => void;
  getTodayReviewWords: () => ReviewRecord[];
  getAllReviewWords: () => ReviewRecord[];
  getReviewCount: () => number;
  isWordInReview: (wordId: string) => boolean;
  getReviewRecord: (wordId: string) => ReviewRecord | undefined;
}

const ReviewContext = createContext<ReviewContextValue | null>(null);

export function ReviewProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reviewReducer, initialState);

  useEffect(() => { loadRecords(); }, []);
  useEffect(() => { if (state.isInitialized) saveRecords(); }, [state.records, state.isInitialized]);

  const loadRecords = async () => {
    try {
      const stored = await AsyncStorage.getItem(REVIEW_STORAGE_KEY);
      dispatch({ type: 'INIT_RECORDS', payload: stored ? JSON.parse(stored) : {} });
    } catch (error) {
      console.error('Failed to load review records:', error);
      dispatch({ type: 'INIT_RECORDS', payload: {} });
    }
  };

  const saveRecords = async () => {
    try { await AsyncStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(state.records)); }
    catch (error) { console.error('Failed to save review records:', error); }
  };

  const addWordToReview = (wordId: string, stage: Stage, textbookId?: string, unitId?: string) => {
    if (state.records[wordId]) return;
    dispatch({ type: 'ADD_WORD', payload: createReviewRecord(wordId, stage, textbookId, unitId) });
  };

  const addWordsToReview = (words: Array<{ wordId: string; stage: Stage; textbookId?: string; unitId?: string }>) => {
    const newRecords = words.filter((w) => !state.records[w.wordId]).map((w) => createReviewRecord(w.wordId, w.stage, w.textbookId, w.unitId));
    if (newRecords.length > 0) dispatch({ type: 'ADD_WORDS', payload: newRecords });
  };

  const reviewWord = (wordId: string, quality: ReviewQuality) => {
    dispatch({ type: 'UPDATE_REVIEW', payload: { wordId, quality } });
  };

  const getTodayReviewWords = (): ReviewRecord[] => getWordsForReview(Object.values(state.records));
  const getAllReviewWords = (): ReviewRecord[] => Object.values(state.records);
  const getReviewCount = (): number => getTodayReviewWords().length;
  const isWordInReview = (wordId: string): boolean => !!state.records[wordId];
  const getReviewRecord = (wordId: string): ReviewRecord | undefined => state.records[wordId];

  const value: ReviewContextValue = { ...state, addWordToReview, addWordsToReview, reviewWord, getTodayReviewWords, getAllReviewWords, getReviewCount, isWordInReview, getReviewRecord };

  return <ReviewContext.Provider value={value}>{children}</ReviewContext.Provider>;
}

export function useReview() {
  const context = useContext(ReviewContext);
  if (!context) throw new Error('useReview must be used within a ReviewProvider');
  return context;
}
