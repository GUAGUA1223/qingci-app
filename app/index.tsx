import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const stages = [
  {
    id: 'preschool',
    name: '🦊 小狐狸学单词',
    slogan: '点点玩玩，就会了',
    gradient: ['#FF9ECD', '#FFD93D'],
    emoji: '🦊',
  },
  {
    id: 'primary',
    name: '🦊 小狐狸·轻词',
    slogan: '聪明如狐，轻松记词',
    gradient: ['#4ECDC4', '#45B7AA'],
    emoji: '🦊',
  },
  {
    id: 'middle',
    name: '轻词',
    slogan: '我的节奏，我的词',
    gradient: ['#5B7FFF', '#8B9DC3'],
    emoji: '📚',
  },
  {
    id: 'high',
    name: '轻词 QingCi',
    slogan: '一词不落，一秒不废',
    gradient: ['#2D3561', '#1E90FF'],
    emoji: '🎯',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleSelect = (stageId: string) => {
    router.push(`/${stageId}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🦊</Text>
          <Text style={styles.logoText}>轻词</Text>
          <Text style={styles.logoSubtext}>QingCi</Text>
        </View>
        <Text style={styles.title}>选择你的学段</Text>
        <View style={styles.cardsContainer}>
          {stages.map((stage) => (
            <TouchableOpacity
              key={stage.id}
              style={[
                styles.stageCard,
                { backgroundColor: stage.gradient[0] },
              ]}
              onPress={() => handleSelect(stage.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.stageEmoji}>{stage.emoji}</Text>
              <Text style={styles.stageName}>{stage.name}</Text>
              <Text style={styles.stageSlogan}>{stage.slogan}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.loginText}>已有账号？登录</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 20, alignItems: 'center' },
  logoSection: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  logoEmoji: { fontSize: 80, marginBottom: 10 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#333' },
  logoSubtext: { fontSize: 14, color: '#666', marginTop: 4 },
  title: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 24 },
  cardsContainer: { width: '100%', gap: 16 },
  stageCard: {
    borderRadius: 20, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  stageEmoji: { fontSize: 48, marginBottom: 12 },
  stageName: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  stageSlogan: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8 },
  loginButton: { marginTop: 40, paddingVertical: 12, paddingHorizontal: 24 },
  loginText: { fontSize: 14, color: '#666' },
});
