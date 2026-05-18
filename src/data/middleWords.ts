export interface MiddleWord {
  word: string;
  phonetic: string;
  meaning: string;
  sentence: string;
  memoryTip: string;
  image?: string;
  examFreq: number;
  partOfSpeech: string;
  difficulty: number;
}

export const middleWords: MiddleWord[] = [
  { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃，遗弃', sentence: 'The team decided to abandon the project due to lack of funds.', memoryTip: '谐音"我班的等"，我们班的人在等（你回来），别放弃！', examFreq: 4, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'absorb', phonetic: '/əbˈzɔːrb/', meaning: 'v. 吸收，吸引', sentence: 'Plants absorb water from the soil.', memoryTip: '谐音"饿不择食"，吸收营养不需要选择', examFreq: 3, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', meaning: 'v. 完成，达到', sentence: 'She accomplished her goal of learning English in one year.', memoryTip: '谐音"可咔姆铺里稀"，完成了可咔姆铺里的稀有任务', examFreq: 3, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'accurate', phonetic: '/ˈækjərət/', meaning: 'adj. 准确的，精确的', sentence: 'The weather forecast was accurate today.', memoryTip: '谐音"爱可求瑞特"，追求准确的数据', examFreq: 4, partOfSpeech: 'adj.', difficulty: 1 },
  { word: 'achieve', phonetic: '/əˈtʃiːv/', meaning: 'v. 完成，达到，获得', sentence: 'Hard work helped him achieve success.', memoryTip: '谐音"饿吃屋"，想获得食物，先完成捕猎', examFreq: 5, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'acquire', phonetic: '/əˈkwaɪər/', meaning: 'v. 获得，学到', sentence: 'She acquired a good knowledge of French.', memoryTip: '谐音"饿快耳"，获得快速听力能力', examFreq: 4, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'adapt', phonetic: '/əˈdæpt/', meaning: 'v. 使适应，改编', sentence: 'Animals must adapt to survive in the wild.', memoryTip: '谐音"饿带扑特"，适应环境才能生存', examFreq: 4, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'adequate', phonetic: '/ˈædɪkwət/', meaning: 'adj. 足够的，适当的', sentence: 'We have adequate food for the trip.', memoryTip: '谐音"爱滴可卧特"，有足够的爱', examFreq: 3, partOfSpeech: 'adj.', difficulty: 2 },
  { word: 'adjust', phonetic: '/əˈdʒʌst/', meaning: 'v. 调整，调节', sentence: 'Please adjust the volume on the TV.', memoryTip: '谐音"饿扎斯特"，调整状态', examFreq: 3, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'admire', phonetic: '/ədˈmaɪər/', meaning: 'v. 钦佩，羡慕', sentence: 'I admire her courage to speak up.', memoryTip: '谐音"饿的迈尔"，羡慕别人的步伐', examFreq: 3, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'adolescent', phonetic: '/ˌædəˈlesnt/', meaning: 'n. 青少年 adj. 青春期的', sentence: 'Many adolescents face pressure from school.', memoryTip: '谐音"爱得乐森特"，青少年时期是充满快乐的', examFreq: 2, partOfSpeech: 'n./adj.', difficulty: 3 },
  { word: 'adventure', phonetic: '/ədˈventʃər/', meaning: 'n. 冒险，冒险经历', sentence: 'Their trip to the jungle was an exciting adventure.', memoryTip: '谐音"饿的温彻尔"，冒险家去探险', examFreq: 3, partOfSpeech: 'n.', difficulty: 1 },
  { word: 'affect', phonetic: '/əˈfekt/', meaning: 'v. 影响，感染', sentence: 'Weather affects crop growth.', memoryTip: '谐音"饿非可特"，影响不是特效', examFreq: 5, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'aggressive', phonetic: '/əˈɡresɪv/', meaning: 'adj. 侵略性的，好斗的', sentence: 'An aggressive dog is not suitable as a pet.', memoryTip: '谐音"饿格瑞西乌"，侵略性的王国', examFreq: 3, partOfSpeech: 'adj.', difficulty: 2 },
  { word: 'ambition', phonetic: '/æmˈbɪʃn/', meaning: 'n. 雄心，抱负', sentence: 'Her ambition is to become a doctor.', memoryTip: '谐音"俺必新"，有抱负的人必创新', examFreq: 3, partOfSpeech: 'n.', difficulty: 2 },
  { word: 'analyze', phonetic: '/ˈænəlaɪz/', meaning: 'v. 分析', sentence: 'The scientist will analyze the data.', memoryTip: '谐音"爱呢赖兹"，分析数据是爱呢的工作', examFreq: 4, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'ancient', phonetic: '/ˈeɪnʃənt/', meaning: 'adj. 古代的，古老的', sentence: 'The Great Wall is an ancient wonder.', memoryTip: '谐音"安申特"，古代安申特人建造的', examFreq: 3, partOfSpeech: 'adj.', difficulty: 1 },
  { word: 'appreciate', phonetic: '/əˈpriːʃieɪt/', meaning: 'v. 感激，欣赏', sentence: 'I appreciate your help very much.', memoryTip: '谐音"饿普瑞稀诶特"，感激别人的稀有帮助', examFreq: 4, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'approach', phonetic: '/əˈproʊtʃ/', meaning: 'n./v. 接近，方法', sentence: 'Winter is approaching quickly.', memoryTip: '谐音"饿普柔吃"，接近食物的方法', examFreq: 5, partOfSpeech: 'n./v.', difficulty: 2 },
  { word: 'appropriate', phonetic: '/əˈproʊpriət/', meaning: 'adj. 适当的 v. 拨出（款项）', sentence: 'Wear appropriate clothes for the interview.', memoryTip: '谐音"饿普柔普瑞厄特"，用适当的方法分配', examFreq: 4, partOfSpeech: 'adj./v.', difficulty: 3 },
  { word: 'approximate', phonetic: '/əˈprɑːksɪmət/', meaning: 'adj. 大约的 v. 接近', sentence: 'The approximate cost is 100 dollars.', memoryTip: '谐音"饿普若可西莫特"，大约需要这些', examFreq: 3, partOfSpeech: 'adj./v.', difficulty: 3 },
  { word: 'approve', phonetic: '/əˈpruːv/', meaning: 'v. 批准，赞同', sentence: 'The committee approved the new plan.', memoryTip: '谐音"饿普如乌乌"，批准后才能进入下一阶段', examFreq: 3, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'argument', phonetic: '/ˈɑːrɡjumənt/', meaning: 'n. 争论，论点', sentence: 'They had an argument about politics.', memoryTip: '谐音"啊哥有门特"，争论是有门道的', examFreq: 4, partOfSpeech: 'n.', difficulty: 1 },
  { word: 'arrange', phonetic: '/əˈreɪndʒ/', meaning: 'v. 安排，排列', sentence: 'Please arrange the books on the shelf.', memoryTip: '谐音"饿瑞恩只"，安排瑞恩的工作', examFreq: 3, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'assign', phonetic: '/əˈsaɪn/', meaning: 'v. 分配，指派', sentence: 'The teacher assigned homework to the class.', memoryTip: '谐音"饿萨因"，分配任务的原因', examFreq: 3, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'assist', phonetic: '/əˈsɪst/', meaning: 'v. 帮助，协助', sentence: 'Can you assist me with this heavy box?', memoryTip: '谐音"饿斯特"，协助斯特完成工作', examFreq: 3, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'assume', phonetic: '/əˈsuːm/', meaning: 'v. 假设，认为', sentence: 'I assume you are coming to the party.', memoryTip: '谐音"饿秀姆"，假设你需要表演', examFreq: 5, partOfSpeech: 'v.', difficulty: 2 },
  { word: 'attach', phonetic: '/əˈtætʃ/', meaning: 'v. 附加，系上', sentence: 'Please attach the file to the email.', memoryTip: '谐音"饿太吃"，附加费用太贵', examFreq: 3, partOfSpeech: 'v.', difficulty: 1 },
  { word: 'attempt', phonetic: '/əˈtempt/', meaning: 'n./v. 尝试，试图', sentence: 'She attempted to climb the mountain.', memoryTip: '谐音"饿天普特"，尝试登天的计划', examFreq: 4, partOfSpeech: 'n./v.', difficulty: 1 },
  { word: 'attitude', phonetic: '/ˈætɪtuːd/', meaning: 'n. 态度，看法', sentence: 'A positive attitude helps in life.', memoryTip: '谐音"爱提吐的"，态度决定一切', examFreq: 4, partOfSpeech: 'n.', difficulty: 1 },
];

export const getMiddleWordsByDifficulty = (difficulty: number): MiddleWord[] => middleWords.filter(word => word.difficulty === difficulty);

export const getMiddleLevelWords = (level: number, difficulty?: number): MiddleWord[] => {
  let words = [...middleWords];
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
