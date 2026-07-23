import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

const { width } = Dimensions.get('window');
const HIGH_COLORS = colors.high;

const TOTAL_LEVELS = 8;
const UNLOCKED_LEVELS = 3; // 模拟已通关数

// 每关的描述
const levelDescriptions = [
  { title: '基础词汇', subtitle: '高考核心50词' },
  { title: '动词专项', subtitle: '高频动词突破' },
  { title: '形容词进阶', subtitle: '描述与修饰' },
  { title: '名词拓展', subtitle: '抽象名词训练' },
  { title: '同义替换', subtitle: '灵活表达' },
  { title: '阅读理解', subtitle: '语境中记忆' },
  { title: '写作词汇', subtitle: '高分表达' },
  { title: '终极挑战', subtitle: '全面检测' },
];

export default function HighMap() {
  const router = useRouter();
  const [currentLevel] = useState(UNLOCKED_LEVELS + 1);

  const getNodeStatus = (level: number): 'completed' | 'current' | 'locked' => {
    if (level < currentLevel) return 'completed';
    if (level === currentLevel) return 'current';
    return 'locked';
  };

  const handleNodePress = (level: number) => {
    const status = getNodeStatus(level);
    if (status === 'current') {
      router.push('/high/learn');
    }
  };

  const handleBack = () => {
    router.push('/high');
  };

  // 路径布局
  const levels1 = [1, 2, 3, 4];
  const levels2 = [5, 6, 7, 8];

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>闯关地图</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.mapContent} showsVerticalScrollIndicator={false}>
        {/* 第一排节点 */}
        <View style={styles.levelRow}>
          {levels1.map((level) => {
            const status = getNodeStatus(level);
            const desc = levelDescriptions[level - 1];
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.node,
                  status === 'completed' && styles.nodeCompleted,
                  status === 'current' && styles.nodeCurrent,
                  status === 'locked' && styles.nodeLocked,
                ]}
                onPress={() => handleNodePress(level)}
                activeOpacity={status === 'current' ? 0.7 : 1}
              >
                {status === 'completed' && <Text style={styles.nodeStar}>⭐</Text>}
                {status === 'locked' && <Text style={styles.nodeLock}>🔒</Text>}
                {status === 'current' && <Text style={styles.nodeFox}>🦊</Text>}
                <Text style={[
                  styles.nodeNumber,
                  status === 'locked' && styles.nodeNumberLocked,
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 第一排标签 */}
        <View style={styles.labelsRow}>
          {levels1.map((level) => {
            const status = getNodeStatus(level);
            const desc = levelDescriptions[level - 1];
            return (
              <View key={level} style={styles.labelCol}>
                <Text style={[styles.labelTitle, status === 'locked' && styles.labelLocked]}>{desc.title}</Text>
                <Text style={[styles.labelSub, status === 'locked' && styles.labelLocked]}>{desc.subtitle}</Text>
              </View>
            );
          })}
        </View>

        {/* 连接线 */}
        <View style={styles.connectorSection}>
          <View style={styles.connectorLine} />
          <Text style={styles.connectorArrow}>▼</Text>
          <View style={styles.connectorLine} />
        </View>

        {/* 第二排节点 */}
        <View style={styles.levelRow}>
          {levels2.map((level) => {
            const status = getNodeStatus(level);
            const desc = levelDescriptions[level - 1];
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.node,
                  status === 'completed' && styles.nodeCompleted,
                  status === 'current' && styles.nodeCurrent,
                  status === 'locked' && styles.nodeLocked,
                ]}
                onPress={() => handleNodePress(level)}
                activeOpacity={status === 'current' ? 0.7 : 1}
              >
                {status === 'completed' && <Text style={styles.nodeStar}>⭐</Text>}
                {status === 'locked' && <Text style={styles.nodeLock}>🔒</Text>}
                {status === 'current' && <Text style={styles.nodeFox}>🦊</Text>}
                <Text style={[
                  styles.nodeNumber,
                  status === 'locked' && styles.nodeNumberLocked,
                ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 第二排标签 */}
        <View style={styles.labelsRow}>
          {levels2.map((level) => {
            const status = getNodeStatus(level);
            const desc = levelDescriptions[level - 1];
            return (
              <View key={level} style={styles.labelCol}>
                <Text style={[styles.labelTitle, status === 'locked' && styles.labelLocked]}>{desc.title}</Text>
                <Text style={[styles.labelSub, status === 'locked' && styles.labelLocked]}>{desc.subtitle}</Text>
              </View>
            );
          })}
        </View>

        {/* 总进度 */}
        <View style={styles.progressCard}>
          <Text style={styles.progressEmoji}>🏆</Text>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              已通关 {UNLOCKED_LEVELS}/{TOTAL_LEVELS} 关
            </Text>
            <View style={styles.miniProgressBar}>
              <View style={[styles.miniProgressFill, { width: `${(UNLOCKED_LEVELS / TOTAL_LEVELS) * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* 当前关提示 */}
        {currentLevel <= TOTAL_LEVELS && (
          <View style={styles.hintCard}>
            <Text style={styles.hintEmoji}>🦊</Text>
            <Text style={styles.hintText}>
              点击第 {currentLevel} 关开始挑战
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HIGH_COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: HIGH_COLORS.primary,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mapContent: {
    paddingVertical: 32,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    marginBottom: 12,
  },
  labelCol: {
    alignItems: 'center',
    width: (width - 32) / 4,
  },
  labelTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  labelSub: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: 2,
  },
  labelLocked: {
    opacity: 0.4,
  },
  connectorSection: {
    alignItems: 'center',
    marginVertical: 8,
    gap: 4,
  },
  connectorLine: {
    width: 2,
    height: 16,
    backgroundColor: HIGH_COLORS.secondary,
    opacity: 0.4,
  },
  connectorArrow: {
    fontSize: 12,
    color: HIGH_COLORS.secondary,
    opacity: 0.6,
  },
  node: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  nodeCompleted: {
    backgroundColor: HIGH_COLORS.secondary,
  },
  nodeCurrent: {
    backgroundColor: '#FFD93D',
    borderWidth: 3,
    borderColor: HIGH_COLORS.secondary,
    shadowColor: '#FFD93D',
    shadowOpacity: 0.4,
  },
  nodeLocked: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  nodeStar: {
    fontSize: 18,
    position: 'absolute',
    top: -6,
    right: -2,
  },
  nodeLock: {
    fontSize: 20,
    opacity: 0.5,
  },
  nodeFox: {
    fontSize: 24,
  },
  nodeNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  nodeNumberLocked: {
    color: 'rgba(255,255,255,0.3)',
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
    backgroundColor: HIGH_COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  progressEmoji: {
    fontSize: 28,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  miniProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: HIGH_COLORS.secondary,
    borderRadius: 3,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: 'rgba(30,144,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(30,144,255,0.3)',
  },
  hintEmoji: {
    fontSize: 20,
  },
  hintText: {
    fontSize: 14,
    color: HIGH_COLORS.secondary,
    fontWeight: '600',
  },
});
