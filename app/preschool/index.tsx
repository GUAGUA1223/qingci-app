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

const { width } = Dimensions.get('window');

export default function PreschoolHome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部小狐狸+星星 */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={styles.backArrow}>{'‹'}</Text>
        </TouchableOpacity>
        <Image source={foxImages.happy} style={styles.foxImage} resizeMode="contain" />
        <View style={styles.starBadge}>
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={styles.starCount}>12</Text>
        </View>
      </View>

      {/* 今日进度（简洁版，用图标不用文字） */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: '65%' }]} />
        </View>
        <Text style={styles.progressEmoji}>📊</Text>
      </View>

      {/* 3个大按钮 - 用emoji图标，不写文字说明 */}
      <View style={styles.buttonsSection}>
        {/* 📚 开始学习 */}
        <TouchableOpacity style={styles.bigButtonLearn} onPress={() => router.push('/preschool/learn')} activeOpacity={0.8}>
          <Text style={styles.buttonEmoji}>📚</Text>
          <Text style={styles.buttonLabel}>开始学习</Text>
        </TouchableOpacity>

        {/* 📊 学习进度 */}
        <TouchableOpacity style={styles.bigButtonProgress} onPress={() => {}} activeOpacity={0.8}>
          <Text style={styles.buttonEmoji}>📊</Text>
          <Text style={styles.buttonLabelProgress}>学习进度</Text>
        </TouchableOpacity>

        {/* 🏠 狐狸的家 */}
        <TouchableOpacity style={styles.bigButtonFox} onPress={() => router.push('/fox-home')} activeOpacity={0.8}>
          <Text style={styles.buttonEmoji}>🦊</Text>
          <Text style={styles.buttonLabel}>狐狸的家</Text>
        </TouchableOpacity>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  foxImage: {
    width: 140,
    height: 140,
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
  starEmoji: {
    fontSize: 18,
  },
  starCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    gap: 10,
  },
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#FFE5EF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF9ECD',
    borderRadius: 6,
  },
  progressEmoji: {
    fontSize: 20,
  },
  buttonsSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 16,
    justifyContent: 'center',
  },
  bigButtonLearn: {
    backgroundColor: '#FF9ECD',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bigButtonProgress: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: '#FFD93D',
  },
  bigButtonFox: {
    backgroundColor: '#4ECDC4',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonEmoji: {
    fontSize: 40,
  },
  buttonLabel: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonLabelProgress: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD93D',
  },
});
