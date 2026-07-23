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

// 星星数量和进度（模拟数据，后续可接store）
const STAR_COUNT = 12;
const TODAY_PROGRESS = 65;

export default function PreschoolHome() {
  const router = useRouter();

  const handleLearn = () => {
    router.push('/preschool/learn');
  };

  const handleFoxHome = () => {
    router.push('/fox-home');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部大图小狐狸 */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Image source={require('../../assets/images/decorations/deco_arrow_left.jpg')} style={styles.backArrow} />
        </TouchableOpacity>
        <Image source={foxImages.happy} style={styles.foxImage} resizeMode="contain" />
        {/* 星星数量 */}
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

      {/* 3个大按钮区域 */}
      <View style={styles.buttonsSection}>
        {/* 开始学习 - 用小狐狸头像图标 */}
        <TouchableOpacity style={styles.bigButton} onPress={handleLearn} activeOpacity={0.8}>
          <Image source={foxImages.excited} style={styles.buttonIcon} />
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabel}>学习</Text>
            <Text style={styles.bigButtonSubLabel}>听音·选图</Text>
          </View>
        </TouchableOpacity>

        {/* 学习进度 - 用书本图标 */}
        <TouchableOpacity style={styles.bigButtonSecondary} onPress={() => {}} activeOpacity={0.8}>
          <Image source={require('../../assets/images/packs/pack_culture.jpg')} style={styles.buttonIcon} />
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabelSecondary}>进度</Text>
            <Text style={styles.bigButtonSubLabelSecondary}>已学单词</Text>
          </View>
        </TouchableOpacity>

        {/* 狐狸的家 - 用小狐狸 */}
        <TouchableOpacity style={styles.bigButtonFox} onPress={handleFoxHome} activeOpacity={0.8}>
          <Image source={foxImages.proud} style={styles.buttonIconFox} />
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabel}>家</Text>
            <Text style={styles.bigButtonSubLabelFox}>和小狐狸玩</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 底部提示 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>轻词</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F8',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FF9ECD',
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
    backgroundColor: '#FFE5EF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF9ECD',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9ECD',
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
    backgroundColor: '#FF9ECD',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#FF9ECD',
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
    backgroundColor: '#4ECDC4',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#4ECDC4',
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
    color: '#CCC',
  },
});
