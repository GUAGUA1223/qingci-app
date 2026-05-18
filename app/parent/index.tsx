import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PIN_STORAGE_KEY = '@qingci_parent_pin';
const DEFAULT_PIN = '1234';

export default function ParentHome() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    checkPinExists();
  }, []);

  const checkPinExists = async () => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (storedPin) {
        setIsSettingPin(false);
      } else {
        setIsSettingPin(true);
      }
    } catch (e) {
      console.error('Failed to check PIN:', e);
    }
  };

  const handleNumberPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        if (isSettingPin) {
          if (!showConfirm) {
            setShowConfirm(true);
            setConfirmPin(newPin);
            setPin('');
          } else {
            if (newPin === confirmPin) {
              savePin(newPin);
              setIsVerified(true);
            } else {
              Alert.alert('两次输入不一致', '请重新设置4位数字密码', [
                { text: '好的', onPress: () => {
                  setPin('');
                  setConfirmPin('');
                  setShowConfirm(false);
                }}
              ]);
            }
          }
        } else {
          verifyPin(newPin);
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
    }
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      if (enteredPin === storedPin) {
        setIsVerified(true);
        Vibration.vibrate(50);
      } else {
        Vibration.vibrate([0, 100, 50, 100]);
        Alert.alert('密码错误', '请重新输入', [
          { text: '好的', onPress: () => setPin('') }
        ]);
      }
    } catch (e) {
      console.error('Failed to verify PIN:', e);
      if (enteredPin === DEFAULT_PIN) {
        setIsVerified(true);
      }
    }
  };

  const savePin = async (newPin: string) => {
    try {
      await AsyncStorage.setItem(PIN_STORAGE_KEY, newPin);
    } catch (e) {
      console.error('Failed to save PIN:', e);
    }
  };

  const handleResetPin = () => {
    Alert.alert(
      '重置密码',
      '确定要重置密码吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            await AsyncStorage.removeItem(PIN_STORAGE_KEY);
            setPin('');
            setConfirmPin('');
            setShowConfirm(false);
            setIsSettingPin(true);
          }
        }
      ]
    );
  };

  const renderPinDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <View
          key={i}
          style={[styles.dot, pin.length > i && styles.dotFilled]}
        />
      );
    }
    return dots;
  };

  const renderNumberPad = () => {
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];
    return (
      <View style={styles.numberPad}>
        {numbers.map((num, index) => {
          if (num === '') {
            return <View key={index} style={styles.numberButton} />;
          }
          if (num === 'del') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.numberButton}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Text style={styles.deleteText}>⌫</Text>
              </TouchableOpacity>
            );
          }
          return (
            <TouchableOpacity
              key={index}
              style={styles.numberButton}
              onPress={() => handleNumberPress(num)}
              activeOpacity={0.7}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  if (!isVerified) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.emoji}>👨‍👩‍👧</Text>
          <Text style={styles.title}>
            {isSettingPin ? (showConfirm ? '确认新密码' : '设置密码') : '家长入口'}
          </Text>
          <Text style={styles.subtitle}>
            {isSettingPin
              ? (showConfirm ? '请再次输入4位数字' : '请设置4位数字密码')
              : '请输入4位数字密码'}
          </Text>
        </View>
        <View style={styles.pinContainer}>{renderPinDots()}</View>
        {renderNumberPad()}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetPin}>
          <Text style={styles.resetText}>忘记密码？</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return <ParentDashboard router={router} />;
}

interface ParentDashboardProps {
  router: ReturnType<typeof useRouter>;
}

function ParentDashboard({ router }: ParentDashboardProps) {
  const recentStudyInfo = {
    lastStudyDate: '今天',
    wordsToday: 8,
    totalWords: 120,
    streakDays: 7,
  };

  const menuItems = [
    {
      icon: '⏰',
      title: '学习时间管理',
      subtitle: '设置每日/周学习上限',
      color: '#4ECDC4',
      route: '/parent/time-limit',
    },
    {
      icon: '📊',
      title: '学习周报',
      subtitle: '查看本周学习情况',
      color: '#FF6B6B',
      route: '/parent/weekly-report',
    },
    {
      icon: '🌟',
      title: '小狐狸状态',
      subtitle: '查看小狐狸成长进度',
      color: '#FFD93D',
      route: '/parent/fox-status',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboardHeader}>
        <View>
          <Text style={styles.welcomeText}>👨‍👩‍👧 家长空间</Text>
          <Text style={styles.welcomeSubtext}>陪伴是最好的教育</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.menuIconText}>{item.icon}</Text>
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.recentCard}>
        <Text style={styles.recentTitle}>📝 最近学习概览</Text>
        <View style={styles.recentStats}>
          <View style={styles.recentStatItem}>
            <Text style={styles.recentStatValue}>{recentStudyInfo.wordsToday}</Text>
            <Text style={styles.recentStatLabel}>今日学词</Text>
          </View>
          <View style={styles.recentStatItem}>
            <Text style={styles.recentStatValue}>{recentStudyInfo.totalWords}</Text>
            <Text style={styles.recentStatLabel}>总词汇量</Text>
          </View>
          <View style={styles.recentStatItem}>
            <Text style={styles.recentStatValue}>{recentStudyInfo.streakDays}</Text>
            <Text style={styles.recentStatLabel}>连续天数</Text>
          </View>
        </View>
      </View>

      <Text style={styles.footerText}>轻词 - 让孩子轻松学英语</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F9FF' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 40 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666' },
  pinContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 40 },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#E0E0E0' },
  dotFilled: { backgroundColor: '#4ECDC4' },
  numberPad: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', paddingHorizontal: 40, gap: 20 },
  numberButton: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  numberText: { fontSize: 28, fontWeight: '600', color: '#333' },
  deleteText: { fontSize: 24, color: '#666' },
  resetButton: { marginTop: 40, alignSelf: 'center' },
  resetText: { fontSize: 14, color: '#999', textDecorationLine: 'underline' },
  dashboardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20,
  },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#4ECDC4' },
  welcomeSubtext: { fontSize: 14, color: '#666', marginTop: 4 },
  backButton: { backgroundColor: '#4ECDC4', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  backButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  menuContainer: { paddingHorizontal: 20, gap: 12 },
  menuCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  menuIcon: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuIconText: { fontSize: 24 },
  menuInfo: { flex: 1, marginLeft: 12 },
  menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  menuSubtitle: { fontSize: 12, color: '#999', marginTop: 2 },
  menuArrow: { fontSize: 24, color: '#CCC' },
  recentCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginHorizontal: 20, marginTop: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  recentTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  recentStats: { flexDirection: 'row', justifyContent: 'space-around' },
  recentStatItem: { alignItems: 'center' },
  recentStatValue: { fontSize: 24, fontWeight: 'bold', color: '#4ECDC4' },
  recentStatLabel: { fontSize: 12, color: '#999', marginTop: 4 },
  footerText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginTop: 'auto', marginBottom: 20 },
});
