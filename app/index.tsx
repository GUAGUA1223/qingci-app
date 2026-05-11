import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, spacing } from '../src/theme/colors';

export default function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF9F0', '#FFE4D6']}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>📚</Text>
          <Text style={styles.title}>轻词</Text>
          <Text style={styles.subtitle}>轻松学英语</Text>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('PreschoolIndex')}
          >
            <LinearGradient
              colors={['#FF6B6B', '#EE5A5A']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnIcon}>🎓</Text>
              <Text style={styles.btnTitle}>学前闯关</Text>
              <Text style={styles.btnSubtitle}>适合3-6岁</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <LinearGradient
              colors={['#74B9FF', '#5CA8F0']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnIcon}>🏫</Text>
              <Text style={styles.btnTitle}>小学英语</Text>
              <Text style={styles.btnSubtitle}>即将上线</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryBtn}>
            <LinearGradient
              colors={['#55EFC4', '#45DDB3']}
              style={styles.btnGradient}
            >
              <Text style={styles.btnIcon}>📖</Text>
              <Text style={styles.btnTitle}>初中英语</Text>
              <Text style={styles.btnSubtitle}>即将上线</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>172个学前单词 · 5个关卡</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
  },
  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  buttons: {
    marginTop: 60,
    gap: spacing.lg,
  },
  primaryBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  secondaryBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    opacity: 0.7,
  },
  btnGradient: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  btnIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  btnTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  btnSubtitle: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
});
