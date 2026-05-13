import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { FoxState, FoxAction, FoxMood, FoxStage, Achievement } from '../types';
import { achievements } from '../data/achievements';

export const FOX_STAGES = [
  { name: '小团子', days: 0 },
  { name: '竖耳朵', days: 3 },
  { name: '大尾巴', days: 7 },
  { name: '金冠狐', days: 21 },
  { name: '星空天使', days: 66 },
];

// 获取初始状态
const getInitialState = (): FoxState => ({
  stage: 0,
  name: '小狐',
  consecutiveDays: 0,
  totalWords: 0,
  mood: 'happy',
  accessories: [],
  lastStudyDate: '',
  currentStreak: 0,
  longestStreak: 0,
  masteredWords: [],
  unlockedAchievements: [],
});

// 计算心情
const calculateMood = (lastStudyDate: string, consecutiveDays: number): FoxMood => {
  if (!lastStudyDate) return 'happy';
  
  const today = new Date().toISOString().split('T')[0];
  const lastDate = new Date(lastStudyDate);
  const todayDate = new Date(today);
  const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) return 'happy';
  if (daysDiff === 1) return 'sleepy';
  if (daysDiff >= 2) return 'hungry';
  return 'happy';
};

// 计算阶段
const calculateStage = (consecutiveDays: number): FoxStage => {
  if (consecutiveDays >= 66) return 4;
  if (consecutiveDays >= 21) return 3;
  if (consecutiveDays >= 7) return 2;
  if (consecutiveDays >= 3) return 1;
  return 0;
};

// 检查并解锁成就
const checkAchievements = (state: FoxState): string[] => {
  const newUnlocks: string[] = [];
  
  achievements.forEach((achievement) => {
    if (state.unlockedAchievements.includes(achievement.id)) return;
    
    let shouldUnlock = false;
    
    switch (achievement.id) {
      case 'first_word':
        shouldUnlock = state.totalWords >= 1;
        break;
      case 'ten_words':
        shouldUnlock = state.totalWords >= 10;
        break;
      case 'fifty_words':
        shouldUnlock = state.totalWords >= 50;
        break;
      case 'hundred_words':
        shouldUnlock = state.totalWords >= 100;
        break;
      case 'three_days':
        shouldUnlock = state.currentStreak >= 3;
        break;
      case 'seven_days':
        shouldUnlock = state.currentStreak >= 7;
        break;
      case 'perfect_level':
        break;
      case 'fox_ears':
        shouldUnlock = state.stage >= 1;
        break;
      case 'fox_wings':
        shouldUnlock = state.stage >= 4;
        break;
    }
    
    if (shouldUnlock) {
      newUnlocks.push(achievement.id);
    }
  });
  
  return newUnlocks;
};

// Reducer
const foxReducer = (state: FoxState, action: FoxAction): FoxState => {
  switch (action.type) {
    case 'STUDY_WORD': {
      const today = new Date().toISOString().split('T')[0];
      const newMasteredWords = state.lastStudyDate === today
        ? state.masteredWords
        : [...state.masteredWords, action.payload.wordId];
      
      return {
        ...state,
        totalWords: state.totalWords + 1,
        masteredWords: newMasteredWords,
      };
    }
    
    case 'COMPLETE_LEVEL': {
      const today = new Date().toISOString().split('T')[0];
      const isPerfect = action.payload.correctCount === action.payload.totalCount;
      const newUnlocks = [...state.unlockedAchievements];
      
      if (isPerfect && !newUnlocks.includes('perfect_level')) {
        newUnlocks.push('perfect_level');
      }
      
      let newConsecutiveDays = state.consecutiveDays;
      let newCurrentStreak = state.currentStreak;
      let newLongestStreak = state.longestStreak;
      
      if (state.lastStudyDate !== today) {
        const lastDate = state.lastStudyDate ? new Date(state.lastStudyDate) : null;
        const todayDate = new Date(today);
        
        if (lastDate) {
          const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            newConsecutiveDays = state.consecutiveDays + 1;
            newCurrentStreak = state.currentStreak + 1;
          } else if (daysDiff > 1) {
            newConsecutiveDays = 1;
            newCurrentStreak = 1;
          }
        } else {
          newConsecutiveDays = 1;
          newCurrentStreak = 1;
        }
        
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      }
      
      const newStage = calculateStage(newConsecutiveDays);
      const mood = 'excited';
      
      let updatedState = {
        ...state,
        consecutiveDays: newConsecutiveDays,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        stage: newStage,
        mood,
        lastStudyDate: today,
        unlockedAchievements: newUnlocks,
      };
      
      const achievementUnlocks = checkAchievements(updatedState);
      if (achievementUnlocks.length > 0) {
        updatedState.unlockedAchievements = [...updatedState.unlockedAchievements, ...achievementUnlocks];
      }
      
      return updatedState;
    }
    
    case 'UPDATE_STREAK': {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastStudyDate === today) return state;
      
      const lastDate = state.lastStudyDate ? new Date(state.lastStudyDate) : null;
      const todayDate = new Date(today);
      
      let newConsecutiveDays = state.consecutiveDays;
      let newCurrentStreak = state.currentStreak;
      let newLongestStreak = state.longestStreak;
      
      if (lastDate) {
        const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          newConsecutiveDays = state.consecutiveDays + 1;
          newCurrentStreak = state.currentStreak + 1;
        } else if (daysDiff > 1) {
          newConsecutiveDays = 1;
          newCurrentStreak = 1;
        }
      } else {
        newConsecutiveDays = 1;
        newCurrentStreak = 1;
      }
      
      newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      const newStage = calculateStage(newConsecutiveDays);
      
      let updatedState = {
        ...state,
        consecutiveDays: newConsecutiveDays,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        stage: newStage,
        lastStudyDate: today,
        mood: calculateMood(today, newConsecutiveDays),
      };
      
      const achievementUnlocks = checkAchievements(updatedState);
      if (achievementUnlocks.length > 0) {
        updatedState.unlockedAchievements = [...updatedState.unlockedAchievements, ...achievementUnlocks];
      }
      
      return updatedState;
    }
    
    case 'CHANGE_NAME': {
      return {
        ...state,
        name: action.payload.name,
      };
    }
    
    case 'ADD_ACCESSORY': {
      if (state.accessories.includes(action.payload.accessory)) return state;
      return {
        ...state,
        accessories: [...state.accessories, action.payload.accessory],
      };
    }
    
    case 'UNLOCK_ACHIEVEMENT': {
      if (state.unlockedAchievements.includes(action.payload.achievementId)) return state;
      return {
        ...state,
        unlockedAchievements: [...state.unlockedAchievements, action.payload.achievementId],
      };
    }
    
    case 'LOAD_STATE': {
      return action.payload;
    }
    
    default:
      return state;
  }
};

// Context
interface FoxContextType {
  state: FoxState;
  dispatch: React.Dispatch<FoxAction>;
  studyWord: (wordId: string) => void;
  completeLevel: (correctCount: number, totalCount: number) => void;
  changeName: (name: string) => void;
  addAccessory: (accessory: string) => void;
  getStageName: () => string;
  getMoodEmoji: () => string;
  getEncouragement: () => string;
}

const FoxContext = createContext<FoxContextType | undefined>(undefined);

// Storage key
const STORAGE_KEY = '@fox_state';

// Provider
export const FoxProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(foxReducer, getInitialState());
  const [isLoaded, setIsLoaded] = React.useState(false);

  // 加载保存的状态
  useEffect(() => {
    try {
      const savedData = globalThis.localStorage?.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        parsed.mood = calculateMood(parsed.lastStudyDate, parsed.consecutiveDays);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch (e) {
      console.log('Using default fox state');
    }
    setIsLoaded(true);
  }, []);

  // 保存状态
  useEffect(() => {
    if (!isLoaded) return;
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.log('Failed to save fox state');
    }
  }, [state, isLoaded]);
  
  const studyWord = (wordId: string) => {
    dispatch({ type: 'STUDY_WORD', payload: { wordId } });
  };
  
  const completeLevel = (correctCount: number, totalCount: number) => {
    dispatch({ type: 'COMPLETE_LEVEL', payload: { correctCount, totalCount } });
  };
  
  const changeName = (name: string) => {
    dispatch({ type: 'CHANGE_NAME', payload: { name } });
  };
  
  const addAccessory = (accessory: string) => {
    dispatch({ type: 'ADD_ACCESSORY', payload: { accessory } });
  };
  
  const getStageName = (): string => {
    const names = ['小团子', '竖耳朵', '大尾巴', '金冠狐', '星空天使'];
    return names[state.stage];
  };
  
  const getMoodEmoji = (): string => {
    const emojis: Record<FoxMood, string> = {
      happy: '😊',
      sleepy: '😴',
      hungry: '🥺',
      proud: '😎',
      excited: '🤩',
    };
    return emojis[state.mood];
  };
  
  const getEncouragement = (): string => {
    const encouragements: Record<FoxMood, string> = {
      happy: '今天状态不错！',
      sleepy: '我有点困了~来学几个词吧',
      hungry: '好几天没见了，想你了~',
      proud: '你太厉害了！',
      excited: '又学会了新词！',
    };
    return encouragements[state.mood];
  };
  
  return (
    <FoxContext.Provider
      value={{
        state,
        dispatch,
        studyWord,
        completeLevel,
        changeName,
        addAccessory,
        getStageName,
        getMoodEmoji,
        getEncouragement,
      }}
    >
      {children}
    </FoxContext.Provider>
  );
};

export const useFox = (): FoxContextType => {
  const context = useContext(FoxContext);
  if (!context) {
    throw new Error('useFox must be used within a FoxProvider');
  }
  return context;
};
