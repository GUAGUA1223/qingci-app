// 动画帧配置
export const ANIMATION_FRAMES = {
  idle: [
    require('../../assets/images/animation/fox_idle_1.jpg'),
    require('../../assets/images/animation/fox_idle_2.jpg'),
    require('../../assets/images/animation/fox_idle_3.jpg'),
    require('../../assets/images/animation/fox_idle_4.jpg'),
  ],
  celebrate: [
    require('../../assets/images/animation/fox_celebrate_1.jpg'),
    require('../../assets/images/animation/fox_celebrate_2.jpg'),
    require('../../assets/images/animation/fox_celebrate_3.jpg'),
    require('../../assets/images/animation/fox_celebrate_4.jpg'),
  ],
  think: [
    require('../../assets/images/animation/fox_think_1.jpg'),
    require('../../assets/images/animation/fox_think_2.jpg'),
    require('../../assets/images/animation/fox_think_3.jpg'),
    require('../../assets/images/animation/fox_think_4.jpg'),
  ],
  encourage: [
    require('../../assets/images/animation/fox_encourage_1.jpg'),
    require('../../assets/images/animation/fox_encourage_2.jpg'),
    require('../../assets/images/animation/fox_encourage_3.jpg'),
    require('../../assets/images/animation/fox_encourage_4.jpg'),
  ],
  sleepy: [
    require('../../assets/images/animation/fox_sleepy_1.jpg'),
    require('../../assets/images/animation/fox_sleepy_2.jpg'),
    require('../../assets/images/animation/fox_sleepy_3.jpg'),
    require('../../assets/images/animation/fox_sleepy_4.jpg'),
  ],
  correct: [
    require('../../assets/images/animation/fox_correct_1.jpg'),
    require('../../assets/images/animation/fox_correct_2.jpg'),
    require('../../assets/images/animation/fox_correct_3.jpg'),
    require('../../assets/images/animation/fox_correct_4.jpg'),
  ],
  wrong: [
    require('../../assets/images/animation/fox_wrong_1.jpg'),
    require('../../assets/images/animation/fox_wrong_2.jpg'),
    require('../../assets/images/animation/fox_wrong_3.jpg'),
    require('../../assets/images/animation/fox_wrong_4.jpg'),
  ],
} as const;

export type AnimationType = keyof typeof ANIMATION_FRAMES;

// 循环动画类型（播放完一轮后重新开始）
export const LOOP_ANIMATIONS: AnimationType[] = ['idle', 'sleepy'];

// 单次动画类型（播放完后回到idle）
export const ONCE_ANIMATIONS: AnimationType[] = ['celebrate', 'think', 'encourage', 'correct', 'wrong'];
