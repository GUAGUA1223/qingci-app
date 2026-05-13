import { VocabWord } from './types';

export const primaryWords: VocabWord[] = [
  // PEP 三年级上册
  { id: 'PRI_001', word: 'ruler', meaning: '尺子', audio: '', category: 'noun' },
  { id: 'PRI_002', word: 'bag', meaning: '包', audio: '', category: 'noun' },
  { id: 'PRI_003', word: 'pen', meaning: '钢笔', audio: '', category: 'noun' },
  { id: 'PRI_004', word: 'pencil', meaning: '铅笔', audio: '', category: 'noun' },
  { id: 'PRI_005', word: 'eraser', meaning: '橡皮', audio: '', category: 'noun' },
  { id: 'PRI_006', word: 'crayon', meaning: '蜡笔', audio: '', category: 'noun' },
  { id: 'PRI_007', word: 'book', meaning: '书', audio: '', category: 'noun' },
  { id: 'PRI_008', word: 'hello', meaning: '你好', audio: '', category: 'greeting' },
  { id: 'PRI_009', word: 'hi', meaning: '你好', audio: '', category: 'greeting' },
  { id: 'PRI_010', word: 'bye', meaning: '再见', audio: '', category: 'greeting' },
  { id: 'PRI_011', word: 'I', meaning: '我', audio: '', category: 'pronoun' },
  { id: 'PRI_012', word: 'am', meaning: '是', audio: '', category: 'verb' },
  { id: 'PRI_013', word: 'a', meaning: '一个', audio: '', category: 'article' },
  { id: 'PRI_014', word: 'an', meaning: '一个', audio: '', category: 'article' },
  { id: 'PRI_015', word: 'cat', meaning: '猫', audio: '', category: 'animal' },
  { id: 'PRI_016', word: 'dog', meaning: '狗', audio: '', category: 'animal' },
  { id: 'PRI_017', word: 'duck', meaning: '鸭子', audio: '', category: 'animal' },
  { id: 'PRI_018', word: 'pig', meaning: '猪', audio: '', category: 'animal' },
  { id: 'PRI_019', word: 'bear', meaning: '熊', audio: '', category: 'animal' },
  { id: 'PRI_020', word: 'zoo', meaning: '动物园', audio: '', category: 'noun' },
];

export const primaryBookUnits = [
  { id: 'pep3a', name: 'PEP三年级上册', words: primaryWords },
];
