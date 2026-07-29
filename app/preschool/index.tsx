import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../../src/theme/colors';

const { width } = Dimensions.get('window');

// 进度（模拟数据，后续接store）
const TODAY_WORDS = 3;
const TOTAL_WORDS = 10;
const STAR_COUNT = 12;

export default function PreschoolHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部操作栏 */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.topBtn}
          onPress={() => router.push('/')}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Image
            source={require('../../assets/images/decorations/deco_arrow_left.jpg')}
            style={styles.topIcon}
          />
        </TouchableOpacity>
        <Text style={styles.brandText}>轻词</Text>
        <TouchableOpacity style={styles.topBtn}>
          <Image
            source={require('../../assets/images/decorations/deco_star_lamp.jpg')}
            style={styles.topIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 顶部装饰条 */}
      <View style={styles.accentBar} />

      {/* 橙橙卡片区域 */}
      <View style={styles.foxCardSection}>
        <View style={styles.foxCard}>
          {/* 3D橙橙 - 趴在卡片上边缘 */}
          <View style={styles.foxImageWrapper}>
            <Image
              source={require('../../assets/images/fox/fox_3d_main.jpg')}
              style={styles.foxImage}
              resizeMode="contain"
            />
          </View>

          {/* 进度条 - 纯图标化，无文字 */}
          <View style={styles.progressBarRow}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(TODAY_WORDS / TOTAL_WORDS) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressCount}>
              {TODAY_WORDS}/{TOTAL_WORDS}
            </Text>
          </View>
        </View>
      </View>

      {/* 主按钮 - 开始 */}
      <View style={styles.mainBtnSection}>
        <TouchableOpacity
          style={styles.mainBtn}
          onPress={() => router.push('/preschool/learn')}
          activeOpacity={0.8}
        >
          <Image source={require('../../assets/images/icons/icon_learn.png')} style={styles.mainBtnIcon} />
          <Text style={styles.mainBtnText}>开始</Text>
        </TouchableOpacity>
      </View>

      {/* 2x2 功能入口 */}
      <View style={styles.gridSection}>
        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/preschool/learn')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/icons/icon_learn.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridLabel}>学习</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => router.push('/preschool/learn')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/icons/icon_listen.png')')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridLabel}>听一听</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/icons/icon_review.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridLabel}>复习</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridCard}
            onPress={() => {}}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/icons/icon_challenge.png')}
              style={styles.gridIcon}
            />
            <Text style={styles.gridLabel}>闯关</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 底部打卡指示器 */}
      <View style={styles.footer}>
        <View style={styles.dotRow}>
          {[1, 2, 3, 4, 5, 6, 7].map((d) => (
            <View
              key={d}
              style={[
                styles.dot,
                d <= 5 ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
        <View style={styles.streakBadge}>
          <Image
            source={require('../../assets/images/decorations/deco_star_lamp.jpg')}
            style={styles.streakIcon}
          />
          <Text style={styles.streakText}>5天</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.preschool.bg, // #FFF5F8
  },
  // 顶部操作栏
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    height: 48,
  },
  topBtn: {
    padding: 4,
  },
  topIcon: {
    width: 24,
    height: 24,
  },
  brandText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.preschool.primary, // #FF9ECD
  },
  // 装饰条
  accentBar: {
    height: 8,
    backgroundColor: colors.preschool.primary,
  },
  // 橙橙卡片
  foxCardSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  foxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 0,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  foxImageWrapper: {
    marginTop: -40,
    marginBottom: 8,
  },
  foxImage: {
    width: 200,
    height: 200,
  },
  // 进度条
  progressBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: '#FFE5EF',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.preschool.primary,
    borderRadius: 5,
  },
  progressCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.preschool.primary,
    minWidth: 36,
    textAlign: 'right',
  },
  // 主按钮
  mainBtnSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  mainBtn: {
    backgroundColor: colors.preschool.primary,
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.preschool.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mainBtnIcon: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  mainBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // 2x2网格
  gridSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  gridIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  // 底部
  footer: {
    alignItems: 'center',
    paddingTop: 20,
    gap: 8,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: colors.preschool.primary,
  },
  dotInactive: {
    backgroundColor: '#FFE5EF',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakIcon: {
    width: 14,
    height: 14,
  },
  streakText: {
    fontSize: 12,
    color: '#999',
  },
});
