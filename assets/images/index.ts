// 图片资源映射 - 统一管理所有图片资源路径

// 小狐狸角色图
export const foxImages = {
  // 暂用占位图，后续替换
  default: require('./fox/fox_stage0.jpg'),
};

// 成就徽章图 - 新的UI设计
export const badgeImages = {
  beginner: require('./badge_beginner.png'),  // 入门小将 0-100词
  growth: require('./badge_growth.png'),      // 词汇达人 100-500词
  legend: require('./badge_legend.png'),      // 神话王者 500+词
};

// 词包图标
export const packImages = {
  animals: require('./packs/pack_animals.jpg'),
  food: require('./packs/pack_food.jpg'),
  sports: require('./packs/pack_sports.jpg'),
  weather: require('./packs/pack_weather.jpg'),
  travel: require('./packs/pack_travel.jpg'),
  science: require('./packs/pack_science.jpg'),
  culture: require('./packs/pack_culture.jpg'),
  academic: require('./packs/pack_academic.jpg'),
  career: require('./packs/pack_career.jpg'),
};

// 背景图 - 新的UI设计
export const backgroundImages = {
  splash: require('./splash_bg.png'),        // 起始页背景
  learn: require('./learn_bg.png'),           // 学习页背景
  wordCard: require('./word_card_bg.png'),   // 单词卡片背景
};
