import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ParentSettings } from '../types';

const DEFAULT_SETTINGS: ParentSettings = {
  dailyLimitMinutes: 20,
  weeklyStudyDays: 5,
  restDays: [0, 6],
  gentleReminderEnabled: true,
  customReminderText: undefined,
};

const GENTLE_REMINDERS = [
  '今天学得很棒啦！休息一下吧~',
  '今天表现很优秀，休息一下再继续吧~',
  '学习时间到啦，休息一下眼睛吧~',
  '今天学了很多呢，休息一会儿吧~',
];

type ParentSettingsAction =
  | { type: 'SET_SETTINGS'; payload: ParentSettings }
  | { type: 'UPDATE_DAILY_LIMIT'; payload: number }
  | { type: 'UPDATE_WEEKLY_DAYS'; payload: number }
  | { type: 'UPDATE_REST_DAYS'; payload: number[] }
  | { type: 'TOGGLE_GENTLE_REMINDER'; payload: boolean };

interface ParentSettingsContextType {
  settings: ParentSettings;
  updateSettings: (settings: ParentSettings) => void;
  updateDailyLimit: (minutes: number) => void;
  updateWeeklyDays: (days: number) => void;
  updateRestDays: (days: number[]) => void;
  toggleGentleReminder: (enabled: boolean) => void;
  getGentleReminder: () => string;
}

const ParentSettingsContext = createContext<ParentSettingsContextType | undefined>(undefined);
const STORAGE_KEY = '@qingci_parent_settings';

const parentSettingsReducer = (state: ParentSettings, action: ParentSettingsAction): ParentSettings => {
  switch (action.type) {
    case 'SET_SETTINGS': return action.payload;
    case 'UPDATE_DAILY_LIMIT': return { ...state, dailyLimitMinutes: action.payload };
    case 'UPDATE_WEEKLY_DAYS': return { ...state, weeklyStudyDays: action.payload };
    case 'UPDATE_REST_DAYS': return { ...state, restDays: action.payload };
    case 'TOGGLE_GENTLE_REMINDER': return { ...state, gentleReminderEnabled: action.payload };
    default: return state;
  }
};

export const ParentSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, dispatch] = useReducer(parentSettingsReducer, DEFAULT_SETTINGS);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSettings = JSON.parse(stored) as ParentSettings;
          dispatch({ type: 'SET_SETTINGS', payload: { ...DEFAULT_SETTINGS, ...parsedSettings } });
        }
      } catch (e) { console.error('Failed to load parent settings:', e); }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }
      catch (e) { console.error('Failed to save parent settings:', e); }
    };
    saveSettings();
  }, [settings]);

  const updateSettings = (newSettings: ParentSettings) => dispatch({ type: 'SET_SETTINGS', payload: newSettings });
  const updateDailyLimit = (minutes: number) => dispatch({ type: 'UPDATE_DAILY_LIMIT', payload: minutes });
  const updateWeeklyDays = (days: number) => dispatch({ type: 'UPDATE_WEEKLY_DAYS', payload: days });
  const updateRestDays = (days: number[]) => dispatch({ type: 'UPDATE_REST_DAYS', payload: days });
  const toggleGentleReminder = (enabled: boolean) => dispatch({ type: 'TOGGLE_GENTLE_REMINDER', payload: enabled });

  const getGentleReminder = (): string => {
    if (!settings.gentleReminderEnabled) return '今天的学习完成啦~';
    const randomIndex = Math.floor(Math.random() * GENTLE_REMINDERS.length);
    return settings.customReminderText || GENTLE_REMINDERS[randomIndex];
  };

  return (
    <ParentSettingsContext.Provider value={{ settings, updateSettings, updateDailyLimit, updateWeeklyDays, updateRestDays, toggleGentleReminder, getGentleReminder }}>
      {children}
    </ParentSettingsContext.Provider>
  );
};

export const useParentSettings = (): ParentSettingsContextType => {
  const context = useContext(ParentSettingsContext);
  if (!context) { throw new Error('useParentSettings must be used within a ParentSettingsProvider'); }
  return context;
};
