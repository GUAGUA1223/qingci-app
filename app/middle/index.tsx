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
const STAR_COUNT = 24;
const TODAY_PROGRESS = 75;
export default function MiddleHome() {
  const router = useRouter();
  const handleLearn = () => {
    router.push('/middle/learn');
  };
  const handleFoxHome = () => {
    router.push('/fox-home');
  };
  const handleBack = () => {
    router.push('/');
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部：橙橙 + 返回 */}
      <View style={styles.headerSection}>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={handleBack} 
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Image source={require('../../assets/images/decorations/deco_arrow_left.jpg')} style={styles.backArrow} />
        </TouchableOpacity>
        <Image source={foxImages.main3d} style={styles.foxImage} resizeMode="contain" />
        {/* 星星徽章 */}
        <View style={styles.starBadge}>
          <Image source={require('../../assets/images/decorations/deco_star_lamp.jpg')} style={styles.starIcon} />
          <Text style={styles.starCount}>{STAR_COUNT}</Text>
        </View>
      </View>
      {/* 今日进度 */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Image source={require('../../assets/images/packs/pack_academic.jpg')} style={styles.progressIcon} />
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: TODAY_PROGRESS + '%' }]} />
          </View>
          <Text style={styles.progressText}>{TODAY_PROGRESS}%</Text>
        </View>
        <Text style={styles.progressLabel}>今日进度</Text>
      </View>
      {/* 3个主按钮 */}
      <View style={styles.buttonsSection}>
        {/* 开始学习 */}
        <TouchableOpacity style={styles.bigButton} onPress={handleLearn} activeOpacity={0.8}>
          <Image source={foxImages.excited} style={styles.buttonIcon} />
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabel}>开始学习</Text>
            <Text style={styles.bigButtonSubLabel}>看义选词</Text>
          </View>
        </TouchableOpacity>
        {/* 学习进度 */}
        <TouchableOpacity style={styles.bigButtonSecondary} onPress={() => {}} activeOpacity={0.8}>
          <Image source={require('../../assets/images/packs/pack_culture.jpg')} style={styles.buttonIcon} />
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabelSecondary}>已学</Text>
            <Text style={styles.bigButtonSubLabelSecondary}>查看进度</Text>
          </View>
        </TouchableOpacity>
        {/* 橙橙的家 */}
        <TouchableOpacity style={styles.bigButtonFox} onPress={handleFoxHome} activeOpacity={0.8}>
          <Image source={foxImages.proud} style={styles.buttonIconFox} />
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabel}>橙橙的家</Text>
            <Text style={styles.bigButtonSubLabelFox}>和橙橙玩</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* 底部 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>轻词初中</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.middle.background,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: colors.middle.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    padding: 5,
  },
  backArrow: {
    width: 32,
    height: 32,
  },
  foxImage: {
    width: 160,
    height: 160,
    marginTop: 20,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD93D',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    gap: 6,
  },
  starIcon: {
    width: 24,
    height: 24,
  },
  starCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressIcon: {
    width: 28,
    height: 28,
  },
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E8EDFF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.middle.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.middle.primary,
    minWidth: 45,
    textAlign: 'right',
  },
  progressLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
  },
  buttonsSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
  },
  bigButton: {
    backgroundColor: colors.middle.primary,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: colors.middle.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bigButtonSecondary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: '#FFD93D',
    shadowColor: '#FFD93D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bigButtonFox: {
    backgroundColor: colors.middle.secondary,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: colors.middle.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  buttonIconFox: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  buttonTextRow: {
    flex: 1,
  },
  bigButtonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bigButtonSubLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  bigButtonLabelSecondary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD93D',
  },
  bigButtonSubLabelSecondary: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  bigButtonSubLabelFox: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
