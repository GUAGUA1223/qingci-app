// 课本进度追踪 Store
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stage, TextbookCatalogItem } from '../types/vocabulary';

const PROGRESS_STORAGE_KEY = '@qingci_progress_state';

export interface UnitProgress {
  wordsLearned: number;
  correctRate: number;
  completed: boolean;
  lastStudyDate?: string;
}

export interface TextbookProgress {
  textbookId: string;
  completedUnits: string[];
  unitProgress: Record<string, UnitProgress>;
  isPreview?: boolean;
  previewProgress?: number;
}

export interface ProgressState {
  currentTextbook: string;
  completedTextbooks: string[];
  textbookProgress: Record<string, TextbookProgress>;
  lastStudyDate: string;
  consecutiveDays: number;
}

type ProgressAction =
  | { type: 'SET_STATE'; payload: ProgressState }
  | { type: 'LOAD_STORED_STATE'; payload: ProgressState }
  | { type: 'SET_CURRENT_TEXTBOOK'; payload: string }
  | { type: 'COMPLETE_UNIT'; payload: { textbookId: string; unitId: string } }
  | { type: 'UPDATE_UNIT_PROGRESS'; payload: { textbookId: string; unitId: string; progress: Partial<UnitProgress> } }
  | { type: 'COMPLETE_TEXTBOOK'; payload: string }
  | { type: 'START_PREVIEW'; payload: string }
  | { type: 'UPDATE_PREVIEW_PROGRESS'; payload: { textbookId: string; progress: number } }
  | { type: 'RESET_STREAK' }
  | { type: 'UPDATE_CONSECUTIVE_DAYS'; payload: number };

const initialState: ProgressState = {
  currentTextbook: '',
  completedTextbooks: [],
  textbookProgress: {},
  lastStudyDate: '',
  consecutiveDays: 0,
};

const progressReducer = (state: ProgressState, action: ProgressAction): ProgressState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'LOAD_STORED_STATE':
      return action.payload;
    case 'SET_CURRENT_TEXTBOOK':
      return { ...state, currentTextbook: action.payload };
    case 'COMPLETE_UNIT': {
      const { textbookId, unitId } = action.payload;
      const currentProgress = state.textbookProgress[textbookId] || {
        textbookId,
        completedUnits: [],
        unitProgress: {},
      };
      if (currentProgress.completedUnits.includes(unitId)) return state;
      return {
        ...state,
        textbookProgress: {
          ...state.textbookProgress,
          [textbookId]: {
            ...currentProgress,
            completedUnits: [...currentProgress.completedUnits, unitId],
            unitProgress: {
              ...currentProgress.unitProgress,
              [unitId]: { ...currentProgress.unitProgress[unitId], completed: true },
            },
          },
        },
      };
    }
    case 'UPDATE_UNIT_PROGRESS': {
      const { textbookId, unitId, progress } = action.payload;
      const currentProgress = state.textbookProgress[textbookId] || {
        textbookId,
        completedUnits: [],
        unitProgress: {},
      };
      return {
        ...state,
        textbookProgress: {
          ...state.textbookProgress,
          [textbookId]: {
            ...currentProgress,
            unitProgress: {
              ...currentProgress.unitProgress,
              [unitId]: {
                ...currentProgress.unitProgress[unitId],
                ...progress,
              },
            },
          },
        },
      };
    }
    case 'COMPLETE_TEXTBOOK': {
      if (state.completedTextbooks.includes(action.payload)) return state;
      return {
        ...state,
        completedTextbooks: [...state.completedTextbooks, action.payload],
      };
    }
    case 'START_PREVIEW': {
      const textbookId = action.payload;
      const currentProgress = state.textbookProgress[textbookId] || {
        textbookId,
        completedUnits: [],
        unitProgress: {},
      };
      return {
        ...state,
        textbookProgress: {
          ...state.textbookProgress,
          [textbookId]: {
            ...currentProgress,
            isPreview: true,
            previewProgress: 0,
          },
        },
      };
    }
    case 'UPDATE_PREVIEW_PROGRESS': {
      const { textbookId, progress } = action.payload;
      const currentProgress = state.textbookProgress[textbookId];
      if (!currentProgress) return state;
      return {
        ...state,
        textbookProgress: {
          ...state.textbookProgress,
          [textbookId]: {
            ...currentProgress,
            previewProgress: progress,
          },
        },
      };
    }
    case 'RESET_STREAK':
      return { ...state, consecutiveDays: 0 };
    case 'UPDATE_CONSECUTIVE_DAYS':
      return { ...state, consecutiveDays: action.payload };
    default:
      return state;
  }
};

interface ProgressContextValue extends ProgressState {
  setCurrentTextbook: (textbookId: string) => void;
  completeUnit: (textbookId: string, unitId: string) => void;
  updateUnitProgress: (textbookId: string, unitId: string, progress: Partial<UnitProgress>) => void;
  completeTextbook: (textbookId: string) => void;
  startPreview: (textbookId: string) => void;
  updatePreviewProgress: (textbookId: string, progress: number) => void;
  isTextbookCompleted: (textbookId: string) => boolean;
  isUnitCompleted: (textbookId: string, unitId: string) => boolean;
  getTextbookProgress: (textbookId: string) => TextbookProgress | undefined;
  getTextbookCompletionRate: (textbookId: string, totalUnits: number) => number;
  isPreviewTextbook: (textbookId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  useEffect(() => {
    loadState();
  }, []);

  useEffect(() => {
    if (state.lastStudyDate) {
      saveState();
    }
  }, [state]);

  const loadState = async () => {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
      if (stored) {
        const parsedState = JSON.parse(stored) as ProgressState;
        const today = new Date().toDateString();
        const lastDate = parsedState.lastStudyDate;
        if (lastDate) {
          const lastStudy = new Date(lastDate).toDateString();
          const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastStudy).getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff > 1) {
            parsedState.consecutiveDays = 0;
          }
        }
        dispatch({ type: 'LOAD_STORED_STATE', payload: parsedState });
      }
    } catch (error) {
      console.error('Failed to load progress state:', error);
    }
  };

  const saveState = async () => {
    try {
      await AsyncStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save progress state:', error);
    }
  };

  const setCurrentTextbook = (textbookId: string) => {
    dispatch({ type: 'SET_CURRENT_TEXTBOOK', payload: textbookId });
  };

  const completeUnit = (textbookId: string, unitId: string) => {
    dispatch({ type: 'COMPLETE_UNIT', payload: { textbookId, unitId } });
  };

  const updateUnitProgress = (textbookId: string, unitId: string, progress: Partial<UnitProgress>) => {
    dispatch({ type: 'UPDATE_UNIT_PROGRESS', payload: { textbookId, unitId, progress } });
  };

  const completeTextbook = (textbookId: string) => {
    dispatch({ type: 'COMPLETE_TEXTBOOK', payload: textbookId });
  };

  const startPreview = (textbookId: string) => {
    dispatch({ type: 'START_PREVIEW', payload: textbookId });
  };

  const updatePreviewProgress = (textbookId: string, progress: number) => {
    dispatch({ type: 'UPDATE_PREVIEW_PROGRESS', payload: { textbookId, progress } });
  };

  const isTextbookCompleted = (textbookId: string): boolean => {
    return state.completedTextbooks.includes(textbookId);
  };

  const isUnitCompleted = (textbookId: string, unitId: string): boolean => {
    const progress = state.textbookProgress[textbookId];
    return progress?.completedUnits.includes(unitId) || false;
  };

  const getTextbookProgress = (textbookId: string): TextbookProgress | undefined => {
    return state.textbookProgress[textbookId];
  };

  const getTextbookCompletionRate = (textbookId: string, totalUnits: number): number => {
    const progress = state.textbookProgress[textbookId];
    if (!progress || totalUnits === 0) return 0;
    return Math.round((progress.completedUnits.length / totalUnits) * 100);
  };

  const isPreviewTextbook = (textbookId: string): boolean => {
    return state.textbookProgress[textbookId]?.isPreview || false;
  };

  const value: ProgressContextValue = {
    ...state,
    setCurrentTextbook,
    completeUnit,
    updateUnitProgress,
    completeTextbook,
    startPreview,
    updatePreviewProgress,
    isTextbookCompleted,
    isUnitCompleted,
    getTextbookProgress,
    getTextbookCompletionRate,
    isPreviewTextbook,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within a ProgressProvider');
  return context;
}
