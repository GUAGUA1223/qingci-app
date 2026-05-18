// 拓展词包数据 - 使用图片资源
import { VocabWord, Stage } from '../types/vocabulary';
import { packImages } from '../../assets/images';

export interface ExpansionPack {
  id: string;
  name: string;
  icon: any;
  wordCount: number;
  stage: Stage;
  description: string;
  words: VocabWord[];
}

export const EXPANSION_PACKS: ExpansionPack[] = [
  { id: 'animals', name: '动物世界', icon: packImages.animals, wordCount: 20, stage: 'primary', description: '认识各种可爱的动物朋友', words: [] },
  { id: 'food', name: '美食天地', icon: packImages.food, wordCount: 20, stage: 'primary', description: '各种美味食物的英语表达', words: [] },
  { id: 'sports', name: '运动达人', icon: packImages.sports, wordCount: 15, stage: 'primary', description: '各种运动的英语词汇', words: [] },
  { id: 'travel', name: '环球旅行', icon: packImages.travel, wordCount: 20, stage: 'middle', description: '旅行相关的英语表达', words: [] },
  { id: 'science', name: '科学探索', icon: packImages.science, wordCount: 20, stage: 'middle', description: '科学实验和概念词汇', words: [] },
  { id: 'academic', name: '学术进阶', icon: packImages.academic, wordCount: 25, stage: 'high', description: '高中和大学学术词汇', words: [] },
  { id: 'career', name: '职业天地', icon: packImages.career, wordCount: 25, stage: 'high', description: '各种职业的英语表达', words: [] },
  { id: 'weather', name: '天气百科', icon: packImages.weather, wordCount: 15, stage: 'primary', description: '各种天气现象的英语表达', words: [] },
  { id: 'culture', name: '文化之旅', icon: packImages.culture, wordCount: 20, stage: 'middle', description: '世界文化相关词汇', words: [] },
];

export const getExpansionPackById = (id: string): ExpansionPack | undefined => EXPANSION_PACKS.find(p => p.id === id);
export const getExpansionPacksByStage = (stage: Stage): ExpansionPack[] => EXPANSION_PACKS.filter(p => p.stage === stage);
export const getAllExpansionPacksForStage = (stage: Stage): ExpansionPack[] => EXPANSION_PACKS.filter(p => p.stage === stage);
