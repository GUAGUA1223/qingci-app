import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, spacing } from '../../src/theme/colors';
import { levels } from '../../src/data/preschoolWords';
import { wordImages } from '../../src/assets/images';

interface MapScreenProps {
  navigation: any;
}

const levelConfig: { [key: string]: { bg: string[]; icon: string; emoji: string } } = {
  'PRE_K_001': { bg: ['#FF6B6B', '#EE5A5A'], icon: '🐾', emoji: '🐱🐶🦁' },
  'PRE_K_002': { bg: ['#FFE66D', '#F0D85C'], icon: '🍎', emoji: '🍎🍌🍇' },
  'PRE_K_003': { bg: ['#A29BFE', '#9189ED'], icon: '🎨', emoji: '🎨🔢😊' },
  'PRE_K_004': { bg: ['#74B9FF', '#5CA8F0'], icon: '👨‍👩‍👧', emoji: '👨‍👩‍👧‍👦' },
  'PRE_K_005': { bg: ['#55EFC4', '#45DDB3'], icon: '🎈', emoji: '🚗✈️🚀' },
};

export default function LevelMap({ navigation }: MapScreenProps) {
  const handleLevelSelect = (level: any) => {
    navigation.navigate('Learn', {
      levelId: level.id,
      levelName: level.name,
      words: level.words,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF9F0', '#FFF5E6']}
        style={styles.header}
      >
        <Text style={styles.title}>🗺️ 关卡地图</Text>
        <Text style={styles.subtitle}>选择关卡开始学习</Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mapContainer}>
          {/* 路径线 */}
          <View style={styles.pathLine} />
          
          {/* 关卡节点 */}
          {levels.map((level, index) => {
            const config = levelConfig[level.id];
            const isFirst = index === 0;
            const isLast = index === levels.length - 1;
            
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelNode,
                  { zIndex: levels.length - index }
                ]}
                onPress={() => handleLevelSelect(level)}
                activeOpacity={0.8}
              >
                <View style={styles.nodeContent}>
                  {/* 关卡气泡 */}
                  <LinearGradient
                    colors={config.bg}
                    style={[
                      styles.levelBubble,
                      isFirst && styles.firstBubble,
                      isLast && styles.lastBubble,
                    ]}
                  >
                    <Text style={styles.levelIcon}>{config.icon}</Text>
                    <Text style={styles.levelName}>{level.name}</Text>
                    <Text style={styles.levelWords}>
                      {level.words.length}个单词
                    </Text>
                  </LinearGradient>
                  
                  {/* 预览图片 */}
                  <View style={styles.previewImages}>
                    {level.words.slice(0, 3).map((word, i) => {
                      const img = wordImages[word.word.toLowerCase()];
                      return (
                        <View key={word.id} style={styles.previewItem}>
                          {img ? (
                            <Image source={img} style={styles.previewImg} />
                          ) : (
                            <View style={styles.previewPlaceholder}>
                              <Text style={styles.previewText}>
                                {word.word[0]}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
                
                {/* 连接箭头 */}
                {index < levels.length - 1 && (
                  <View style={styles.arrow}>
                    <Text style={styles.arrowText}>↓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  mapContainer: {
    position: 'relative',
    paddingTop: spacing.md,
  },
  pathLine: {
    position: 'absolute',
    left: '50%',
    top: 80,
    width: 4,
    height: '85%',
    backgroundColor: '#DDD',
    borderRadius: 2,
    marginLeft: -2,
  },
  levelNode: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  nodeContent: {
    alignItems: 'center',
  },
  levelBubble: {
    width: 200,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  firstBubble: {
    borderWidth: 4,
    borderColor: '#FFD700',
  },
  lastBubble: {
    borderWidth: 4,
    borderColor: '#FF6B6B',
  },
  levelIcon: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  levelName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  levelWords: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  previewImages: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  previewItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  arrow: {
    marginTop: spacing.md,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 18,
    color: '#999',
  },
});
