import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '../theme/colors';
import { Stage } from '../types';

interface BottomNavProps {
  stage: Stage;
}

export const BottomNav: React.FC<BottomNavProps> = ({ stage }) => {
  const router = useRouter();
  const pathname = usePathname();
  const themeColors = colors[stage];

  const navItems = [
    { icon: '🏠', route: `/${stage}`, label: '首页' },
    { icon: '🎮', route: `/${stage}/learn`, label: '学习' },
    { icon: '📚', route: `/${stage}/books`, label: '词库' },
    { icon: '🔤', route: `/${stage}/words`, label: '单词' },
    { icon: '👤', route: '/login', label: '我的' },
  ];

  const isActive = (route: string) => pathname === route;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.card }]}>
      {navItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.navItem} onPress={() => router.push(item.route as any)}>
          <Text style={[styles.icon, isActive(item.route) && { color: themeColors.primary }]}>{item.icon}</Text>
          <Text style={[styles.label, { color: isActive(item.route) ? themeColors.primary : '#999' }]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: '#EEE', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  icon: { fontSize: 24, marginBottom: 2 },
  label: { fontSize: 10 },
});
