import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, spacing } from '../../src/theme/colors';
import { levels } from '../../src/data/preschoolWords';

const levelIcons: { [key: string]: string } = {
  'PRE_K_001': '🐾',
  'PRE_K_002': '🍎',
  'PRE_K_003': '🎨',
  'PRE_K_004': '👨‍👩‍👧',
  'PRE_K_005': '🎈',
};

const levelColors: { [key: string]: string[] } = {
  'PRE_K_001': ['#FF6B6B', '#EE5A5A'],
  'PRE_K_002': ['#FFE66D', '#F0D85C'],
  'PRE_K_003': ['#A29BFE', '#9189ED'],
  'PRE_K_004': ['#74B9FF', '#5CA8F0'],
  'PRE_K_005': ['#55EFC4', '#45DDB3'],
};

export default function PreschoolIndex() {
  const [progress, setProgress] = React.useState<{ [key: string]: number }>({});

  React.useEffect(() => {
    // TODO: 从存储读取进度
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF9F0', '#FFF5E6']}
        style={styles.header}
      >
        <Text style={styles.title}>🎓 学前闯关</Text>
        <Text style={styles.subtitle}>轻松学英语，快乐成长</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>172</Text>
            <Text style={styles.statLabel}>单词</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>关卡</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>选择关卡开始学习</Text>
        {levels.map((level, index) => (
          <TouchableOpacity
            key={level.id}
            style={styles.levelCard}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={levelColors[level.id]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.levelGradient}
            >
              <View style={styles.levelLeft}>
                <Text style={styles.levelIcon}>{levelIcons[level.id]}</Text>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelName}>{level.name}</Text>
                  <Text style={styles.levelCount}>{level.words.length}个单词</Text>
                </View>
              </View>
              <View style={styles.levelRight}>
                <View style={styles.progressCircle}>
                  <Text style={styles.progressText}>
                    {Math.round(progress[level.id] || 0)}%
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  levelCard: {
    marginBottom: spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  levelGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  levelInfo: {
    justifyContent: 'center',
  },
  levelName: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  levelCount: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  levelRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
