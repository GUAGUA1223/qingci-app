import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FoxMascotProps {
  size?: number;
  mood?: 'happy' | 'sleepy' | 'hungry' | 'proud' | 'excited';
  stage?: number;
  animated?: boolean;
}

// 新的10级飞狐外观配置（蓝/绿/紫/金）
const STAGE_CONFIG: Record<number, { 
  emoji: string; 
  sizeRatio: number; 
  color: string; 
  glowColor?: string;
  hasCrown?: boolean;
  hasWings?: boolean;
  hasFullCrown?: boolean;
  hasFullGlow?: boolean;
}> = {
  0: { emoji: '🦊', sizeRatio: 0.6, color: '#5B9BD5' }, // 小学徒 - 蓝色小狐狸
  1: { emoji: '🦊', sizeRatio: 0.65, color: '#5B9BD5' }, // 入门小将 - 蓝色
  2: { emoji: '🦊🌿', sizeRatio: 0.65, color: '#70AD47' }, // 词汇新星 - 绿色
  3: { emoji: '🦊🌿', sizeRatio: 0.7, color: '#70AD47' }, // 词汇达人 - 绿色
  4: { emoji: '🦊✨', sizeRatio: 0.7, color: '#9966CC' }, // 飞狐学徒 - 紫色
  5: { emoji: '🦊✨', sizeRatio: 0.75, color: '#9966CC', glowColor: '#CC99FF' }, // 飞狐使者 - 紫色发光
  6: { emoji: '🦊👑', sizeRatio: 0.75, color: '#FFD700', hasCrown: true }, // 飞狐骑士 - 金冠
  7: { emoji: '🦊✨', sizeRatio: 0.8, color: '#FFD700', hasWings: true, glowColor: '#FFE566' }, // 飞狐领主 - 翅膀发光
  8: { emoji: '🦊👑✨', sizeRatio: 0.8, color: '#FFD700', hasFullCrown: true, glowColor: '#FFD700' }, // 神话飞狐 - 全身金冠
  9: { emoji: '🦊👑✨', sizeRatio: 0.85, color: '#FFD700', hasFullGlow: true, glowColor: '#FFFACD' }, // 传说存在 - 全发光
};

const MOOD_CONFIG = {
  happy: { emoji: '😊', color: '#FFE4B5' },
  sleepy: { emoji: '😴', color: '#E6E6FA' },
  hungry: { emoji: '😋', color: '#FFDAB9' },
  proud: { emoji: '😎', color: '#FFD700' },
  excited: { emoji: '🤩', color: '#FFB6C1' },
};

export const FoxMascot: React.FC<FoxMascotProps> = ({ 
  size = 100, 
  mood = 'happy', 
  stage = 0,
  animated = false 
}) => {
  const stageConfig = STAGE_CONFIG[stage] || STAGE_CONFIG[0];
  const moodConfig = MOOD_CONFIG[mood] || MOOD_CONFIG.happy;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* 发光效果 */}
      {(stageConfig.glowColor || stageConfig.hasFullGlow) && animated && (
        <View style={[
          styles.glow, 
          { 
            width: size * (stageConfig.hasFullGlow ? 1.5 : 1.2), 
            height: size * (stageConfig.hasFullGlow ? 1.5 : 1.2),
            backgroundColor: stageConfig.glowColor + '40'
          }
        ]} />
      )}
      
      {/* 翅膀效果（Lv.8飞狐领主） */}
      {stageConfig.hasWings && (
        <View style={styles.wingsContainer}>
          <Text style={[styles.wing, styles.wingLeft, { fontSize: size * 0.3 }]}>🦋</Text>
          <Text style={[styles.wing, styles.wingRight, { fontSize: size * 0.3 }]}>🦋</Text>
        </View>
      )}
      
      {/* 主狐狸 */}
      <Text style={[styles.fox, { fontSize: size * stageConfig.sizeRatio }]}>
        {stageConfig.emoji}
      </Text>
      
      {/* 心情气泡 */}
      <View style={[styles.moodContainer, { backgroundColor: moodConfig.color }]}>
        <Text style={{ fontSize: size * 0.25 }}>{moodConfig.emoji}</Text>
      </View>
      
      {/* 金冠效果（Lv.7飞狐骑士） */}
      {stageConfig.hasCrown && (
        <View style={styles.crownContainer}>
          <Text style={{ fontSize: size * 0.25 }}>👑</Text>
        </View>
      )}
      
      {/* 全身金冠（Lv.9神话飞狐） */}
      {stageConfig.hasFullCrown && (
        <View style={styles.fullCrownContainer}>
          <Text style={{ fontSize: size * 0.35 }}>✨👑✨</Text>
        </View>
      )}
      
      {/* 全发光（Lv.10传说存在） */}
      {stageConfig.hasFullGlow && (
        <View style={styles.sparklesContainer}>
          <Text style={{ fontSize: size * 0.15 }}>✨</Text>
          <Text style={[styles.sparkleTop, { fontSize: size * 0.15 }]}>✨</Text>
          <Text style={[styles.sparkleBottom, { fontSize: size * 0.15 }]}>✨</Text>
        </View>
      )}
    </View>
  );
};

export const FoxMascotMini: React.FC<{ stage?: number; mood?: FoxMascotProps['mood'] }> = ({ 
  stage = 0, 
  mood = 'happy' 
}) => {
  const stageConfig = STAGE_CONFIG[stage] || STAGE_CONFIG[0];
  const moodConfig = MOOD_CONFIG[mood] || MOOD_CONFIG.happy;

  return (
    <View style={styles.miniContainer}>
      <Text style={styles.miniFox}>{stageConfig.emoji}</Text>
      <Text style={styles.miniMood}>{moodConfig.emoji}</Text>
    </View>
  );
};

// 树苗组件（家长端使用）
interface TreeMascotProps {
  size?: number;
  stage?: number;
  interruptState?: 'healthy' | 'wilted1' | 'wilted3' | 'wilted7' | 'dying';
}

const TREE_CONFIG: Record<number, { emoji: string; description: string }> = {
  0: { emoji: '🌱', description: '小种子' },
  1: { emoji: '🌿', description: '小树苗' },
  2: { emoji: '🌳', description: '小灌木' },
  3: { emoji: '🌲', description: '小树' },
  4: { emoji: '🌳🌿', description: '中等树' },
  5: { emoji: '🌸', description: '开花树' },
  6: { emoji: '🍎', description: '结果树' },
  7: { emoji: '🌳🌳', description: '大树' },
  8: { emoji: '🌴', description: '茂盛大树' },
  9: { emoji: '✨🌳✨', description: '神树' },
};

const INTERRUPT_EMOJI: Record<string, string> = {
  healthy: '💚',
  wilted1: '🍃', // 中断1天：树叶有点蔫
  wilted3: '🍂', // 中断3天：开始落叶
  wilted7: '🥀', // 中断7天：树枝枯萎
  dying: '😢',   // 中断14天：快枯死了
};

export const TreeMascot: React.FC<TreeMascotProps> = ({ 
  size = 100, 
  stage = 0,
  interruptState = 'healthy'
}) => {
  const treeConfig = TREE_CONFIG[stage] || TREE_CONFIG[0];
  const isGlowing = stage === 9;
  const interruptEmoji = INTERRUPT_EMOJI[interruptState] || INTERRUPT_EMOJI.healthy;

  return (
    <View style={[treeStyles.container, { width: size, height: size }]}>
      {/* 神树发光效果 */}
      {isGlowing && (
        <View style={[treeStyles.glow, { width: size * 1.3, height: size * 1.3, backgroundColor: '#90EE9040' }]} />
      )}
      {/* 主树 */}
      <Text style={[treeStyles.tree, { fontSize: size * 0.8 }]}>
        {treeConfig.emoji}
      </Text>
      {/* 中断状态指示 */}
      {interruptState !== 'healthy' && (
        <View style={treeStyles.interruptBadge}>
          <Text style={{ fontSize: size * 0.2 }}>{interruptEmoji}</Text>
        </View>
      )}
      {/* 茂盛指示 */}
      {stage >= 5 && interruptState === 'healthy' && (
        <View style={treeStyles.healthBadge}>
          <Text style={{ fontSize: size * 0.15 }}>💚</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  fox: { textAlign: 'center' },
  moodContainer: { position: 'absolute', bottom: 5, right: 5, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10 },
  glow: { position: 'absolute', borderRadius: 100, zIndex: -1 },
  wingsContainer: { position: 'absolute', flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingHorizontal: 5 },
  wing: { opacity: 0.8 },
  wingLeft: { position: 'absolute', left: -15, top: 20 },
  wingRight: { position: 'absolute', right: -15, top: 20 },
  crownContainer: { position: 'absolute', top: -8, right: 0 },
  fullCrownContainer: { position: 'absolute', top: -15, right: -5 },
  sparklesContainer: { position: 'absolute', width: '100%', height: '100%' },
  sparkleTop: { position: 'absolute', top: -5, left: 5 },
  sparkleBottom: { position: 'absolute', bottom: 10, right: 5 },
  miniContainer: { flexDirection: 'row', alignItems: 'center' },
  miniFox: { fontSize: 24 },
  miniMood: { fontSize: 14, marginLeft: -5 },
});

const treeStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tree: { textAlign: 'center' },
  glow: { position: 'absolute', borderRadius: 100, zIndex: -1 },
  interruptBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(255,200,100,0.8)', borderRadius: 10, padding: 3 },
  healthBadge: { position: 'absolute', top: -5, right: -5 },
});
