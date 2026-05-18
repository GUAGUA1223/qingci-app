import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { foxImages } from '../../assets/images';

const STAR_COUNT = 8;
const TODAY_PROGRESS = 45;

export default function MiddleHome() {
  const router = useRouter();

  const handleLearn = () => {
    // TODO: 实现初中学习页面
    router.push('/');
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部 */}
      <View style={styles.headerSection}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Image source={foxImages.proud} style={styles.foxImage} resizeMode="contain" />
        <View style={styles.starBadge}>
          <Text style={styles.starEmoji}>📚</Text>
          <Text style={styles.starCount}>{STAR_COUNT}</Text>
        </View>
      </View>

      {/* 今日进度 */}
      <View style={styles.progressSection}>
        <View style={styles.progressRow}>
          <Text style={styles.progressIcon}>📖</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: TODAY_PROGRESS + '%' }]} />
          </View>
          <Text style={styles.progressText}>{TODAY_PROGRESS}%</Text>
        </View>
        <Text style={styles.progressLabel}>今日学习进度</Text>
      </View>

      {/* 按钮区域 */}
      <View style={styles.buttonsSection}>
        <TouchableOpacity style={styles.bigButton} onPress={handleLearn} activeOpacity={0.8}>
          <Text style={styles.buttonEmoji}>📝</Text>
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabel}>开始学习</Text>
            <Text style={styles.bigButtonSubLabel}>阅读理解·词汇积累</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bigButtonSecondary} onPress={() => {}} activeOpacity={0.8}>
          <Text style={styles.buttonEmojiSecondary}>📊</Text>
          <View style={styles.buttonTextRow}>
            <Text style={styles.bigButtonLabelSecondary}>学习进度</Text>
            <Text style={styles.bigButtonSubLabelSecondary}>查看已学单词</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.comingSoon} activeOpacity={0.8}>
          <Text style={styles.comingSoonText}>🔜 拼写训练 敬请期待</Text>
        </TouchableOpacity>
      </View>

      {/* 底部 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>轻词初中英语</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#5B7FFF',
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
    width: 160,
    height: 160,
    marginTop: 20,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
    gap: 6,
  },
  starEmoji: {
    fontSize: 20,
  },
  starCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5B7FFF',
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
    fontSize: 28,
  },
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#E0E5FF',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#5B7FFF',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B7FFF',
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
    backgroundColor: '#5B7FFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  buttonEmoji: {
    fontSize: 40,
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
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
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
    borderColor: '#5B7FFF',
  },
  buttonEmojiSecondary: {
    fontSize: 40,
  },
  bigButtonLabelSecondary: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5B7FFF',
  },
  bigButtonSubLabelSecondary: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  comingSoon: {
    backgroundColor: '#E0E5FF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  comingSoonText: {
    fontSize: 16,
    color: '#5B7FFF',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
