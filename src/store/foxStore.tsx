import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FoxState {
  stage: number;
  name: string;
  consecutiveDays: number;
  totalWords: number;
  mood: 'happy' | 'sleepy' | 'hungry' | 'proud' | 'excited';
  accessories: string[];
  lastStudyDate: string;
  unlockedAchievements: string[];
}

// 新的10级飞狐等级体系（按词汇量升级）
export const FOX_STAGES = {
  0: { name: '小学徒', emoji: '🦊', minWords: 0, color: '#5B9BD5', description: '蓝色小狐狸' },
  1: { name: '入门小将', emoji: '🦊', minWords: 51, color: '#5B9BD5', description: '蓝色' },
  2: { name: '词汇新星', emoji: '🦊🌿', minWords: 101, color: '#70AD47', description: '绿色' },
  3: { name: '词汇达人', emoji: '🦊🌿', minWords: 201, color: '#70AD47', description: '绿色' },
  4: { name: '飞狐学徒', emoji: '🦊✨', minWords: 351, color: '#9966CC', description: '紫色' },
  5: { name: '飞狐使者', emoji: '🦊✨', minWords: 501, color: '#9966CC', description: '紫色发光', glow: true },
  6: { name: '飞狐骑士', emoji: '🦊👑', minWords: 751, color: '#FFD700', description: '金冠' },
  7: { name: '飞狐领主', emoji: '🦊✨', minWords: 1001, color: '#FFD700', description: '翅膀发光', wings: true },
  8: { name: '神话飞狐', emoji: '🦊👑✨', minWords: 1501, color: '#FFD700', description: '全身金冠', fullCrown: true },
  9: { name: '传说存在', emoji: '🦊👑✨', minWords: 2001, color: '#FFD700', description: '全发光', fullGlow: true },
};

// 树苗体系（家长端）
export const TREE_STAGES = {
  0: { name: '小种子', emoji: '🌱', description: '刚发芽的小苗' },
  1: { name: '小树苗', emoji: '🌿', description: '长出两片叶子' },
  2: { name: '小灌木', emoji: '🌳', description: '叶子变多' },
  3: { name: '小树', emoji: '🌲', description: '开始有树枝' },
  4: { name: '中等树', emoji: '🌳🌿', description: '枝繁叶茂' },
  5: { name: '开花树', emoji: '🌸', description: '树上开花' },
  6: { name: '结果树', emoji: '🍎', description: '结出小果子' },
  7: { name: '大树', emoji: '🌳🌳', description: '树冠饱满' },
  8: { name: '茂盛大树', emoji: '🌴', description: '非常茂盛' },
  9: { name: '神树', emoji: '✨🌳✨', description: '发光的神树', glowing: true },
};

// 树的中断状态
export const TREE_INTERRUPT_STATES = {
  healthy: { name: '健康', emoji: '' },
  wilted1: { name: '有点蔫', emoji: '🍃', days: 1 },
  wilted3: { name: '开始落叶', emoji: '🍂', days: 3 },
  wilted7: { name: '树枝枯萎', emoji: '🥀', days: 7 },
  dying: { name: '快枯死了', emoji: '😢', days: 14 },
};

type FoxAction =
  | { type: 'SET_STATE'; payload: FoxState }
  | { type: 'STUDY_WORD'; payload: { count: number } }
  | { type: 'UPDATE_MOOD'; payload: FoxState['mood'] }
  | { type: 'ADD_ACCESSORY'; payload: string }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'RESET_STREAK' }
  | { type: 'LOAD_STORED_STATE'; payload: FoxState };

const initialState: FoxState = {
  stage: 0,
  name: '小学徒',
  consecutiveDays: 0,
  totalWords: 0,
  mood: 'happy',
  accessories: [],
  lastStudyDate: '',
  unlockedAchievements: [],
};

// 按词汇量计算等级（原按天数）
const calculateStage = (totalWords: number): number => {
  if (totalWords >= 2001) return 9;
  if (totalWords >= 1501) return 8;
  if (totalWords >= 1001) return 7;
  if (totalWords >= 751) return 6;
  if (totalWords >= 501) return 5;
  if (totalWords >= 351) return 4;
  if (totalWords >= 201) return 3;
  if (totalWords >= 101) return 2;
  if (totalWords >= 51) return 1;
  return 0;
};

// 获取下一等级需要的词汇量
export const getWordsForNextStage = (currentStage: number): number | null => {
  if (currentStage >= 9) return null; // 已满级
  const nextStage = FOX_STAGES[(currentStage + 1) as keyof typeof FOX_STAGES];
  return nextStage?.minWords || null;
};

// 计算树的中断状态
export const getTreeInterruptState = (lastStudyDate: string): keyof typeof TREE_INTERRUPT_STATES => {
  if (!lastStudyDate) return 'healthy';
  const today = new Date().toDateString();
  const lastStudy = new Date(lastStudyDate).toDateString();
  const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastStudy).getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff >= 14) return 'dying';
  if (daysDiff >= 7) return 'wilted7';
  if (daysDiff >= 3) return 'wilted3';
  if (daysDiff >= 1) return 'wilted1';
  return 'healthy';
};

const calculateMood = (
  lastStudyDate: string,
  consecutiveDays: number,
  justCompletedLevel: boolean = false,
  perfectScore: boolean = false
): FoxState['mood'] => {
  if (perfectScore) return 'proud';
  if (justCompletedLevel) return 'excited';
  if (!lastStudyDate) return 'happy';
  const today = new Date().toDateString();
  const lastStudy = new Date(lastStudyDate).toDateString();
  const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastStudy).getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff === 0) return 'happy';
  if (daysDiff === 1) return 'sleepy';
  return 'hungry';
};

const foxReducer = (state: FoxState, action: FoxAction): FoxState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'STUDY_WORD': {
      const today = new Date().toDateString();
      const lastDate = state.lastStudyDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      let newConsecutiveDays = state.consecutiveDays;
      if (lastDate === today) {} 
      else if (lastDate === yesterdayStr) { newConsecutiveDays += 1; } 
      else if (!lastDate) { newConsecutiveDays = 1; } 
      else { newConsecutiveDays = 1; }
      const newTotalWords = state.totalWords + action.payload.count;
      const newStage = calculateStage(newTotalWords);
      const newMood = calculateMood(today, newConsecutiveDays);
      // 根据新等级更新名称
      const stageInfo = FOX_STAGES[newStage as keyof typeof FOX_STAGES];
      return { 
        ...state, 
        totalWords: newTotalWords, 
        consecutiveDays: newConsecutiveDays, 
        stage: newStage, 
        mood: newMood, 
        lastStudyDate: today,
        name: stageInfo?.name || '小学徒'
      };
    }
    case 'UPDATE_MOOD':
      return { ...state, mood: action.payload };
    case 'ADD_ACCESSORY':
      if (state.accessories.includes(action.payload)) return state;
      return { ...state, accessories: [...state.accessories, action.payload] };
    case 'UNLOCK_ACHIEVEMENT':
      if (state.unlockedAchievements.includes(action.payload)) return state;
      return { ...state, unlockedAchievements: [...state.unlockedAchievements, action.payload] };
    case 'RESET_STREAK':
      return { ...state, consecutiveDays: 0, stage: 0, mood: 'hungry', name: '小学徒' };
    case 'LOAD_STORED_STATE':
      return action.payload;
    default:
      return state;
  }
};

interface FoxContextType {
  state: FoxState;
  dispatch: React.Dispatch<FoxAction>;
  studyWord: (count?: number) => void;
  setMood: (mood: FoxState['mood']) => void;
  unlockAchievement: (achievementId: string) => void;
  getTreeState: () => { treeStage: number; treeInfo: typeof TREE_STAGES[0]; interruptState: keyof typeof TREE_INTERRUPT_STATES };
}

const FoxContext = createContext<FoxContextType | undefined>(undefined);
const STORAGE_KEY = '@qingci_fox_state';

export const FoxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(foxReducer, initialState);
  
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedState = JSON.parse(stored) as FoxState;
          const today = new Date().toDateString();
          const lastDate = parsedState.lastStudyDate;
          if (lastDate) {
            const lastStudy = new Date(lastDate).toDateString();
            const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastStudy).getTime()) / (1000 * 60 * 60 * 24));
            if (daysDiff > 1) {
              parsedState.consecutiveDays = 0;
              parsedState.mood = 'hungry';
            }
          }
          dispatch({ type: 'LOAD_STORED_STATE', payload: parsedState });
        }
      } catch (e) { console.error('Failed to load fox state:', e); }
    };
    loadState();
  }, []);
  
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) { console.error('Failed to save fox state:', e); }
    };
    if (state.lastStudyDate) saveState();
  }, [state]);

  // 获取树状态（用于家长端）
  const getTreeState = () => {
    const treeStage = state.stage;
    const treeInfo = TREE_STAGES[treeStage as keyof typeof TREE_STAGES] || TREE_STAGES[0];
    const interruptState = getTreeInterruptState(state.lastStudyDate);
    return { treeStage, treeInfo, interruptState };
  };
  
  const studyWord = (count: number = 1) => { dispatch({ type: 'STUDY_WORD', payload: { count } }); };
  const setMood = (mood: FoxState['mood']) => { dispatch({ type: 'UPDATE_MOOD', payload: mood }); };
  const unlockAchievement = (achievementId: string) => { dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievementId }); };
  
  return (
    <FoxContext.Provider value={{ state, dispatch, studyWord, setMood, unlockAchievement, getTreeState }}>
      {children}
    </FoxContext.Provider>
  );
};

export const useFox = (): FoxContextType => {
  const context = useContext(FoxContext);
  if (!context) { throw new Error('useFox must be used within a FoxProvider'); }
  return context;
};
