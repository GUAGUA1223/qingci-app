import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 主题色
const COLORS = {
  primary: '#5B7FFF',
  secondary: '#8B9DC3',
  background: '#F5F7FF',
  card: '#FFFFFF',
  text: '#333333',
  accent: '#FF9A5C',
};

const TOTAL_LEVELS = 8;
const UNLOCKED_LEVELS = 3; // 模拟已通关数

export default function MiddleMap() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentLevel] = useState(UNLOCKED_LEVELS + 1); // 当前关卡

  const getNodeStatus = (level: number) => {
    if (level < currentLevel) return 'completed';
    if (level === currentLevel) return 'current';
    return 'locked';
  };

  const handleNodePress = (level: number) => {
    const status = getNodeStatus(level);
    if (status === 'current') {
      router.push('/middle/learn');
    }
  };

  const handleBack = () => {
    router.push('/middle');
  };

  // 路径节点排成2行
  const levels1 = [1, 2, 3, 4];
  const levels2 = [5, 6, 7, 8];

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.safeAreaTop, { height: insets.top }]} />

      {/* 顶部 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Text style={styles.backEmoji}>👈</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>闯关地图</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.mapContent}>
        {/* 第一排 */}
        <View style={styles.levelRow}>
          {levels1.map((level) => {
            const status = getNodeStatus(level);
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
                <Text
                  style={[
                    styles.nodeNumber,
                    status === 'locked' && styles.nodeNumberLocked,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 连接线 */}
        <View style={styles.connectorRow}>
          <View style={styles.connectorLine} />
          <View style={styles.connectorLine} />
          <View style={styles.connectorLine} />
          <View style={styles.connectorLine} />
        </View>

        {/* 第二排 */}
        <View style={styles.levelRow}>
          {levels2.map((level) => {
            const status = getNodeStatus(level);
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
                <Text
                  style={[
                    styles.nodeNumber,
                    status === 'locked' && styles.nodeNumberLocked,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 总进度 */}
        <View style={styles.progressInfo}>
          <Text style={styles.progressEmoji}>🏆</Text>
          <Text style={styles.progressLabel}>
            已通关 {UNLOCKED_LEVELS}/{TOTAL_LEVELS} 关
          </Text>
        </View>

        {/* 提示 */}
        {currentLevel <= TOTAL_LEVELS && (
          <View style={styles.hintCard}>
            <Text style={styles.hintText}>点击 🦊 进入第 {currentLevel} 关</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeAreaTop: {
    backgroundColor: COLORS.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
  },
  backBtn: {
    padding: 4,
    width: 40,
  },
  backEmoji: {
    fontSize: 26,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mapContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  connectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 20,
    marginLeft: '10%',
  },
  connectorLine: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.primary,
    opacity: 0.4,
  },
  node: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  nodeCompleted: {
    backgroundColor: COLORS.primary,
  },
  nodeCurrent: {
    backgroundColor: '#FFD93D',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  nodeLocked: {
    backgroundColor: '#E0E0E0',
  },
  nodeStar: {
    fontSize: 22,
    position: 'absolute',
    top: -8,
    right: -4,
  },
  nodeLock: {
    fontSize: 24,
  },
  nodeFox: {
    fontSize: 28,
  },
  nodeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  nodeNumberLocked: {
    color: '#999',
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 40,
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  progressEmoji: {
    fontSize: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  hintCard: {
    marginTop: 20,
    backgroundColor: '#EBF0FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  hintText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
