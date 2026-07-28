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
import { foxImages } from '../../assets/images';
import { colors } from '../../src/theme/colors';
const { width } = Dimensions.get('window');
const HIGH_COLORS = colors.high;
const TODAY_PROGRESS = 65;
const TOTAL_WORDS_TODAY = 30;
const LEARNED_WORDS = 20;
export default function HighHome() {
  const router = useRouter();
  const handleSpeedLearn = () => {
    router.push('/high/learn');
  };
  const handleChallenge = () => {
    router.push('/high/map');
  };
  const handleFoxHome = () => {
    router.push('/fox-home');
  };
  const handleBack = () => {
    router.push('/');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部区域 */}
      <View style={styles.headerSection}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Image
            source={require('../../assets/images/decorations/deco_arrow_left.jpg')}
            style={styles.backArrowImg}
          />
        </TouchableOpacity>
        {/* 橙橙 + 进度 */}
        <View style={styles.foxRow}>
          <Image source={foxImages.main3d} style={styles.foxImage} resizeMode="contain" />
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>今日进度</Text>
            <Text style={styles.progressDetail}>
              {LEARNED_WORDS}/{TOTAL_WORDS_TODAY} 词
            </Text>
          </View>
        </View>
        {/* 进度条 */}
        <View style={styles.progressRow}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${TODAY_PROGRESS}%` }]} />
          </View>
          <Text style={styles.progressPercent}>{TODAY_PROGRESS}%</Text>
        </View>
      </View>
      {/* 3个主按钮 */}
      <View style={styles.buttonsSection}>
        {/* 速记模式 */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleSpeedLearn}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/packs/pack_academic.jpg')}
            style={styles.buttonIcon}
          />
          <View style={styles.buttonTextCol}>
            <Text style={styles.mainButtonLabel}>速记</Text>
            <Text style={styles.mainButtonSub}>快速记忆</Text>
          </View>
        </TouchableOpacity>
        {/* 挑战模式 */}
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: '#1E90FF' }]}
          onPress={handleChallenge}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/packs/pack_culture.jpg')}
            style={styles.buttonIcon}
          />
          <View style={styles.buttonTextCol}>
            <Text style={styles.mainButtonLabel}>闯关</Text>
            <Text style={styles.mainButtonSub}>逐级突破</Text>
          </View>
        </TouchableOpacity>
        {/* 橙橙的家 */}
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: '#FF6B6B' }]}
          onPress={handleFoxHome}
          activeOpacity={0.8}
        >
          <Image source={foxImages.proud} style={styles.buttonIconFox} />
          <View style={styles.buttonTextCol}>
            <Text style={styles.mainButtonLabel}>橙橙的家</Text>
            <Text style={styles.mainButtonSub}>和橙橙玩</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* 底部 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>轻词高中</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HIGH_COLORS.background,
  },
  headerSection: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: HIGH_COLORS.primary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  backArrowImg: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  foxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  foxImage: {
    width: 80,
    height: 80,
  },
  progressInfo: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  progressDetail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  progressBarBg: {
    flex: 1,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: HIGH_COLORS.secondary,
    borderRadius: 5,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: HIGH_COLORS.secondary,
    minWidth: 40,
    textAlign: 'right',
  },
  buttonsSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  mainButton: {
    backgroundColor: HIGH_COLORS.primary,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  buttonIconFox: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  buttonTextCol: {
    flex: 1,
  },
  mainButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mainButtonSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 1,
  },
});
