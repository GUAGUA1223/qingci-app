// 学前单词图片映射 - 关联英文单词与对应的图片资源
// 后续需要替换为教育插画风格的图片以提高识别度

export const wordImages: Record<string, any> = {
  // ============ 基础词汇 ============
  apple: require('../../assets/images/word_images/apple.jpg'),
  cat: require('../../assets/images/word_images/cat.jpg'),
  dog: require('../../assets/images/word_images/dog.jpg'),
  sun: require('../../assets/images/word_images/sun.jpg'),
  fish: require('../../assets/images/word_images/fish.jpg'),
  bird: require('../../assets/images/word_images/bird.jpg'),
  egg: require('../../assets/images/word_images/egg.jpg'),
  milk: require('../../assets/images/word_images/milk.jpg'),
  hat: require('../../assets/images/word_images/hat.jpg'),
  car: require('../../assets/images/word_images/car.jpg'),
  ball: require('../../assets/images/word_images/ball.jpg'),
  book: require('../../assets/images/word_images/book.jpg'),
  bed: require('../../assets/images/word_images/bed.jpg'),
  cup: require('../../assets/images/word_images/cup.jpg'),
  key: require('../../assets/images/word_images/key.jpg'),
  
  // ============ 动物主题 ============
  pig: require('../../assets/images/word_images/pig.jpg'),
  bee: require('../../assets/images/word_images/bee.jpg'),
  ant: require('../../assets/images/word_images/ant.jpg'),
  duck: require('../../assets/images/word_images/duck.jpg'),
  lion: require('../../assets/images/word_images/lion.jpg'),
  bear: require('../../assets/images/word_images/bear.jpg'),
  rabbit: require('../../assets/images/word_images/rabbit.jpg'),
  monkey: require('../../assets/images/word_images/monkey.jpg'),
  horse: require('../../assets/images/word_images/horse.jpg'),
  sheep: require('../../assets/images/word_images/sheep.jpg'),
  cow: require('../../assets/images/word_images/cow.jpg'),
  frog: require('../../assets/images/word_images/frog.jpg'),
  snake: require('../../assets/images/word_images/snake.jpg'),
  mouse: require('../../assets/images/word_images/mouse.jpg'),
  deer: require('../../assets/images/word_images/deer.jpg'),
  
  // ============ 颜色主题 ============
  red: require('../../assets/images/word_images/red.jpg'),
  blue: require('../../assets/images/word_images/blue.jpg'),
  yellow: require('../../assets/images/word_images/yellow.jpg'),
  green: require('../../assets/images/word_images/green.jpg'),
  pink: require('../../assets/images/word_images/pink.jpg'),
  
  // ============ 自然主题 ============
  tree: require('../../assets/images/word_images/tree.jpg'),
  flower: require('../../assets/images/word_images/flower.jpg'),
  star: require('../../assets/images/word_images/star.jpg'),
  moon: require('../../assets/images/word_images/moon.jpg'),
  cloud: require('../../assets/images/word_images/cloud.jpg'),
  
  // ============ 身体部位 ============
  eye: require('../../assets/images/word_images/eye.jpg'),
  ear: require('../../assets/images/word_images/ear.jpg'),
  nose: require('../../assets/images/word_images/nose.jpg'),
  mouth: require('../../assets/images/word_images/mouth.jpg'),
  hand: require('../../assets/images/word_images/hand.jpg'),
  foot: require('../../assets/images/word_images/foot.jpg'),
  head: require('../../assets/images/word_images/head.jpg'),
  arm: require('../../assets/images/word_images/arm.jpg'),
  leg: require('../../assets/images/word_images/leg.jpg'),
  face: require('../../assets/images/word_images/face.jpg'),
  
  // ============ 家庭主题 ============
  mom: require('../../assets/images/word_images/mom.jpg'),
  dad: require('../../assets/images/word_images/dad.jpg'),
  brother: require('../../assets/images/word_images/brother.jpg'),
  sister: require('../../assets/images/word_images/sister.jpg'),
  baby: require('../../assets/images/word_images/baby.jpg'),
  home: require('../../assets/images/word_images/home.jpg'),
  door: require('../../assets/images/word_images/door.jpg'),
  toy: require('../../assets/images/word_images/toy.jpg'),
  
  // ============ 更多动物 ============
  elephant: require('../../assets/images/word_images/elephant.jpg'),
  tiger: require('../../assets/images/word_images/tiger.jpg'),
  chicken: require('../../assets/images/word_images/chicken.jpg'),
  butterfly: require('../../assets/images/word_images/butterfly.jpg'),
  turtle: require('../../assets/images/word_images/turtle.jpg'),
  giraffe: require('../../assets/images/word_images/giraffe.jpg'),
  zebra: require('../../assets/images/word_images/zebra.jpg'),
  whale: require('../../assets/images/word_images/whale.jpg'),
  panda: require('../../assets/images/word_images/panda.jpg'),
  kangaroo: require('../../assets/images/word_images/kangaroo.jpg'),
  
  // ============ 天气与状态 ============
  rainbow: require('../../assets/images/word_images/rainbow.jpg'),
  hot: require('../../assets/images/word_images/hot.jpg'),
  cold: require('../../assets/images/word_images/cold.jpg'),
  sunny: require('../../assets/images/word_images/sunny.jpg'),
  happy: require('../../assets/images/word_images/happy.jpg'),
  
  // ============ 进阶词汇 ============
  applejuice: require('../../assets/images/word_images/apple_juice.jpg'),
  busstop: require('../../assets/images/word_images/bus_stop.jpg'),
  teacup: require('../../assets/images/word_images/tea_cup.jpg'),
  fire: require('../../assets/images/word_images/fire.jpg'),
  boat: require('../../assets/images/word_images/boat.jpg'),
  plane: require('../../assets/images/word_images/plane.jpg'),
  train: require('../../assets/images/word_images/train.jpg'),
  cake: require('../../assets/images/word_images/cake.jpg'),
  cookie: require('../../assets/images/word_images/cookie.jpg'),
  bread: require('../../assets/images/word_images/bread.jpg'),
};

// 获取单词对应的图片，如果不存在返回null
export function getWordImage(word: string): any {
  // 尝试直接匹配
  if (wordImages[word]) {
    return wordImages[word];
  }
  // 尝试小写匹配
  const lowerWord = word.toLowerCase().replace(/\s+/g, '');
  if (wordImages[lowerWord]) {
    return wordImages[lowerWord];
  }
  // 尝试去掉空格的匹配
  const noSpaceWord = word.replace(/\s+/g, '');
  if (wordImages[noSpaceWord]) {
    return wordImages[noSpaceWord];
  }
  return null;
}

// 获取所有单词列表（用于生成选项）
export function getAllWordKeys(): string[] {
  return Object.keys(wordImages);
}
