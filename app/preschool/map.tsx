import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { foxImages } from '../../assets/images';

const TOTAL_LEVELS = 8;
const UNLOCKED_LEVELS = 3; // 模拟已通关数

export default function PreschoolMap() {
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
      router.push('/preschool/learn');
    }
  };

  const handleBack = () => {
    router.push('/preschool');
  };

  // 路径节点排成3行
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
          <Image source={require('../../assets/images/decorations/deco_arrow_left.jpg')} style={styles.backIcon} />
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
                {status === 'completed' && <Image source={require('../../assets/images/decorations/deco_star_lamp.jpg')} style={styles.nodeStarImg} />}
                {status === 'locked' && <Image source={require('../../assets/images/icons/icon_challenge.png')} style={styles.nodeLockImg} />}
                {status === 'current' && <Image source={foxImages.main3d} style={styles.nodeFoxImg} resizeMode="contain" />}
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
                {status === 'completed' && <Image source={require('../../assets/images/decorations/deco_star_lamp.jpg')} style={styles.nodeStarImg} />}
                {status === 'locked' && <Image source={require('../../assets/images/icons/icon_challenge.png')} style={styles.nodeLockImg} />}
                {status === 'current' && <Image source={foxImages.main3d} style={styles.nodeFoxImg} resizeMode="contain" />}
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

        {/* 总进度 */}
        <View style={styles.progressInfo}>
          <Image source={require('../../assets/images/decorations/deco_star_lamp.jpg')} style={styles.progressIcon} />
          <Text style={styles.progressLabel}>
            已通关 {UNLOCKED_LEVELS}/{TOTAL_LEVELS} 关
          </Text>
        </View>

        {/* 提示 */}
        {currentLevel <= TOTAL_LEVELS && (
          <View style={styles.hintCard}>
            <View style={styles.hintRow}><Image source={foxImages.main3d} style={styles.hintFoxImg} resizeMode="contain" /><Text style={styles.hintText}>点击进入第 {currentLevel} 关</Text></View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8FFF9',
  },
  safeAreaTop: {
    backgroundColor: '#E8FFF9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#4ECDC4',
  },
  backBtn: {
    padding: 4,
    width: 40,
  },
  backIcon: {
    width: 28,
    height: 28,
    tintColor: '#FFFFFF',
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
    backgroundColor: '#4ECDC4',
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
    backgroundColor: '#4ECDC4',
  },
  nodeCurrent: {
    backgroundColor: '#FFD93D',
    borderWidth: 3,
    borderColor: '#FF9ECD',
  },
  nodeLocked: {
    backgroundColor: '#E0E0E0',
  },
  nodeStarImg: {
    width: 20,
    height: 20,
    position: 'absolute',
    top: -6,
    right: -2,
  },
  nodeLockImg: {
    width: 24,
    height: 24,
    opacity: 0.4,
    tintColor: '#999',
  },
  nodeFoxImg: {
    width: 36,
    height: 36,
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  progressIcon: {
    width: 22,
    height: 22,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4ECDC4',
  },
  hintCard: {
    marginTop: 20,
    backgroundColor: '#FFF5F8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hintFoxImg: {
    width: 20,
    height: 20,
  },
  hintText: {
    fontSize: 16,
    color: '#FF9ECD',
    fontWeight: '600',
  },
});
