export interface HighWord {
  word: string;
  phonetic: string;
  meaning: string;
  sentence: string;
  memoryTip: string;
  image?: string;
  examFreq: number;
  partOfSpeech: string;
  difficulty: number;
  synonyms: string[];
  antonyms: string[];
}

export const highWords: HighWord[] = [
  { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃，抛弃 n. 放任', sentence: 'Never abandon your dreams no matter what happens.', memoryTip: '谐音"我班的等"，我们班的人都在等（你回来），别放弃！', examFreq: 5, partOfSpeech: 'v./n.', difficulty: 2, synonyms: ['quit', 'desert', 'forsake'], antonyms: ['preserve', 'maintain'] },
  { word: 'abolish', phonetic: '/əˈbɒlɪʃ/', meaning: 'v. 废除，取消', sentence: 'The new government decided to abolish the old law.', memoryTip: '谐音"饿报力史"，废除旧报，力推新史', examFreq: 3, partOfSpeech: 'v.', difficulty: 3, synonyms: ['eliminate', 'cancel'], antonyms: ['establish', 'enact'] },
  { word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: 'adj. 抽象的 n. 摘要 v. 提取', sentence: 'Philosophy deals with abstract concepts.', memoryTip: '谐音"爱不斯踹可特"，抽象的思维抽走了能量', examFreq: 4, partOfSpeech: 'adj./n./v.', difficulty: 3, synonyms: ['theoretical', 'conceptual'], antonyms: ['concrete', 'specific'] },
  { word: 'abundant', phonetic: '/əˈbʌndənt/', meaning: 'adj. 丰富的，充裕的', sentence: 'China is abundant in natural resources.', memoryTip: '谐音"饿办等特"，有丰富的资源等着被开发', examFreq: 4, partOfSpeech: 'adj.', difficulty: 2, synonyms: ['plentiful', 'rich'], antonyms: ['scarce', 'lacking'] },
  { word: 'accelerate', phonetic: '/əkˈseləreɪt/', meaning: 'v. 加速，促进', sentence: 'The car accelerated to catch up with the bus.', memoryTip: '谐音"饿可塞乐瑞特"，加速是为了赛乐跑', examFreq: 4, partOfSpeech: 'v.', difficulty: 2, synonyms: ['speed up', 'quicken'], antonyms: ['decelerate', 'slow'] },
  { word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', meaning: 'v. 容纳，使适应', sentence: 'This hotel can accommodate 500 guests.', memoryTip: '谐音"饿靠莫得特"，适应环境才能到达目的地', examFreq: 4, partOfSpeech: 'v.', difficulty: 3, synonyms: ['adapt', 'adjust', 'fit'], antonyms: ['incommodate'] },
  { word: 'accumulate', phonetic: '/əˈkjuːmjəleɪt/', meaning: 'v. 积累，堆积', sentence: 'Dust accumulates on the desk during winter.', memoryTip: '谐音"饿可友莫来特"，积累可友莫来打扰', examFreq: 4, partOfSpeech: 'v.', difficulty: 2, synonyms: ['collect', 'gather'], antonyms: ['disperse', 'scatter'] },
  { word: 'accurate', phonetic: '/ˈækjərət/', meaning: 'adj. 准确的，精确的', sentence: 'The scientist made accurate measurements.', memoryTip: '谐音"爱可求瑞特"，追求准确的数据', examFreq: 5, partOfSpeech: 'adj.', difficulty: 1, synonyms: ['precise', 'exact'], antonyms: ['inaccurate', 'wrong'] },
  { word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', meaning: 'v. 承认，感谢', sentence: 'I acknowledge your contribution to the project.', memoryTip: '谐音"饿可诺力只"，承认能力只有这么多', examFreq: 5, partOfSpeech: 'v.', difficulty: 2, synonyms: ['admit', 'recognize'], antonyms: ['deny', 'ignore'] },
  { word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: 'v. 获得，取得', sentence: 'She acquired a good reputation through hard work.', memoryTip: '谐音"饿快耳"，获得快速听力能力', examFreq: 5, partOfSpeech: 'v.', difficulty: 2, synonyms: ['obtain', 'gain'], antonyms: ['lose', 'forfeit'] },
  { word: 'adapt', phonetic: '/əˈdæpt/', meaning: 'v. 使适应，改编', sentence: 'Students must adapt to the new teaching method.', memoryTip: '谐音"饿带扑特"，适应环境才能带扑', examFreq: 5, partOfSpeech: 'v.', difficulty: 1, synonyms: ['adjust', 'modify'], antonyms: ['misfit'] },
  { word: 'adequate', phonetic: '/ˈædɪkwət/', meaning: 'adj. 足够的，适当的', sentence: 'The food supply is adequate for the winter.', memoryTip: '谐音"爱滴可卧特"，有足够的爱可以卧', examFreq: 4, partOfSpeech: 'adj.', difficulty: 2, synonyms: ['sufficient', 'enough'], antonyms: ['inadequate', 'insufficient'] },
  { word: 'adjacent', phonetic: '/əˈdʒeɪsnt/', meaning: 'adj. 邻近的，毗连的', sentence: 'The park is adjacent to the school.', memoryTip: '谐音"饿这森特"，邻近这个森林', examFreq: 3, partOfSpeech: 'adj.', difficulty: 3, synonyms: ['nearby', 'adjoining'], antonyms: ['distant', 'far'] },
  { word: 'advocate', phonetic: '/ˈædvəkeɪt/', meaning: 'v. 提倡，拥护 n. 提倡者', sentence: 'She advocates environmental protection.', memoryTip: '谐音"爱德沃可诶特"，提倡爱与德行', examFreq: 5, partOfSpeech: 'v./n.', difficulty: 3, synonyms: ['support', 'promote'], antonyms: ['oppose', 'criticize'] },
  { word: 'aesthetic', phonetic: '/esˈθetɪk/', meaning: 'adj. 美学的，审美的', sentence: 'The building has a strong aesthetic appeal.', memoryTip: '谐音"爱斯塞提可"，有美学价值的塞提可', examFreq: 2, partOfSpeech: 'adj.', difficulty: 3, synonyms: ['artistic', 'beautiful'], antonyms: ['ugly'] },
  { word: 'affect', phonetic: '/əˈfekt/', meaning: 'v. 影响，感动', sentence: 'Climate change affects agriculture worldwide.', memoryTip: '谐音"饿非可特"，影响不是特效', examFreq: 5, partOfSpeech: 'v.', difficulty: 2, synonyms: ['influence', 'impact'], antonyms: ['leave unchanged'] },
  { word: 'aggregate', phonetic: '/ˈæɡrɪɡət/', meaning: 'n. 合计，总数 adj. 合计的 v. 聚集', sentence: 'The aggregate score determines the winner.', memoryTip: '谐音"爱格瑞各特"，聚合各方的力量', examFreq: 2, partOfSpeech: 'n./adj./v.', difficulty: 3, synonyms: ['total', 'sum'], antonyms: ['individual'] },
  { word: 'aggressive', phonetic: '/əˈɡresɪv/', meaning: 'adj. 侵略性的，好斗的', sentence: 'An aggressive marketing strategy helped boost sales.', memoryTip: '谐音"饿格瑞西乌"，侵略性的王国', examFreq: 4, partOfSpeech: 'adj.', difficulty: 2, synonyms: ['hostile', 'assertive'], antonyms: ['peaceful', 'gentle'] },
  { word: 'alleviate', phonetic: '/əˈliːvieɪt/', meaning: 'v. 减轻，缓和', sentence: 'The medicine alleviated the pain.', memoryTip: '谐音"饿力维诶特"，减轻痛苦的力维', examFreq: 4, partOfSpeech: 'v.', difficulty: 3, synonyms: ['ease', 'relieve'], antonyms: ['aggravate', 'worsen'] },
  { word: 'allocate', phonetic: '/ˈæləkeɪt/', meaning: 'v. 分配，拨出', sentence: 'The government will allocate funds for education.', memoryTip: '谐音"爱乐可诶特"，分配快乐可被诶特', examFreq: 4, partOfSpeech: 'v.', difficulty: 2, synonyms: ['distribute', 'assign'], antonyms: ['withhold'] },
  { word: 'ambiguous', phonetic: '/æmˈbɪɡjuəs/', meaning: 'adj. 模糊不清的，歧义的', sentence: 'The instruction is ambiguous and confusing.', memoryTip: '谐音"爱姆比格友斯"，模糊的比格朋友', examFreq: 4, partOfSpeech: 'adj.', difficulty: 3, synonyms: ['vague', 'unclear'], antonyms: ['clear', 'explicit'] },
  { word: 'ambition', phonetic: '/æmˈbɪʃn/', meaning: 'n. 雄心，抱负，野心', sentence: 'His ambition is to become a successful entrepreneur.', memoryTip: '谐音"俺必新"，有抱负的人必创新', examFreq: 4, partOfSpeech: 'n.', difficulty: 2, synonyms: ['aspiration', 'dream'], antonyms: ['meekness'] },
  { word: 'amend', phonetic: '/əˈmend/', meaning: 'v. 修改，修订', sentence: 'The committee voted to amend the constitution.', memoryTip: '谐音"饿门的"，修改门的方法', examFreq: 3, partOfSpeech: 'v.', difficulty: 2, synonyms: ['revise', 'modify'], antonyms: ['preserve'] },
  { word: 'analyze', phonetic: '/ˈænəlaɪz/', meaning: 'v. 分析，解析', sentence: 'We need to analyze the data before making a decision.', memoryTip: '谐音"爱呢赖兹"，分析数据是爱呢的工作', examFreq: 5, partOfSpeech: 'v.', difficulty: 2, synonyms: ['examine', 'study'], antonyms: ['synthesize'] },
  { word: 'annual', phonetic: '/ˈænjuəl/', meaning: 'adj. 年度的，每年的 n. 年刊', sentence: 'The company holds an annual meeting every December.', memoryTip: '谐音"爱纽欧"，每年都爱扭欧', examFreq: 4, partOfSpeech: 'adj./n.', difficulty: 1, synonyms: ['yearly', 'annual'], antonyms: ['monthly', 'weekly'] },
  { word: 'anticipate', phonetic: '/ænˈtɪsɪpeɪt/', meaning: 'v. 预期，期望', sentence: 'We anticipate a large turnout for the event.', memoryTip: '谐音"安提西普诶特"，期望安提西来普', examFreq: 5, partOfSpeech: 'v.', difficulty: 2, synonyms: ['expect', 'foresee'], antonyms: ['surprise'] },
  { word: 'apparent', phonetic: '/əˈpærənt/', meaning: 'adj. 明显的，表面上的', sentence: 'It was apparent that she was upset.', memoryTip: '谐音"饿拍润特"，表面上看似拍了', examFreq: 4, partOfSpeech: 'adj.', difficulty: 2, synonyms: ['obvious', 'clear'], antonyms: ['hidden', 'obscure'] },
  { word: 'appreciate', phonetic: '/əˈpriːʃieɪt/', meaning: 'v. 感激，欣赏，增值', sentence: 'I really appreciate your help with this project.', memoryTip: '谐音"饿普瑞稀诶特"，感激别人的稀有帮助', examFreq: 5, partOfSpeech: 'v.', difficulty: 2, synonyms: ['value', 'grateful'], antonyms: ['depreciate', 'disparage'] },
  { word: 'approach', phonetic: '/əˈproʊtʃ/', meaning: 'n./v. 接近，方法，途径', sentence: 'We need a new approach to solve this problem.', memoryTip: '谐音"饿普柔吃"，接近食物的方法', examFreq: 5, partOfSpeech: 'n./v.', difficulty: 2, synonyms: ['method', 'strategy'], antonyms: ['retreat'] },
  { word: 'appropriate', phonetic: '/əˈproʊpriət/', meaning: 'adj. 适当的 v. 拨款，占用', sentence: 'Wear appropriate clothing for the job interview.', memoryTip: '谐音"饿普柔普瑞厄特"，用适当的方法分配', examFreq: 5, partOfSpeech: 'adj./v.', difficulty: 3, synonyms: ['suitable', 'proper'], antonyms: ['inappropriate', 'unsuitable'] },
];

export const getHighWordsByDifficulty = (difficulty: number): HighWord[] => highWords.filter(word => word.difficulty === difficulty);

export const getHighLevelWords = (level: number, difficulty?: number): HighWord[] => {
  let words = [...highWords];
  if (difficulty) words = words.filter(w => w.difficulty === difficulty);
  const easy = words.filter(w => w.difficulty === 1);
  const medium = words.filter(w => w.difficulty === 2);
  const hard = words.filter(w => w.difficulty === 3);
  if (level <= 2) return shuffleArray([...easy.slice(0, 7), ...medium.slice(0, 3)]).slice(0, 10);
  else if (level <= 4) return shuffleArray([...easy.slice(0, 3), ...medium.slice(0, 4), ...hard.slice(0, 3)]).slice(0, 10);
  else return shuffleArray(hard).slice(0, 10);
};

const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};
