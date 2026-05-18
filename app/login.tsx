import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('提示', '请输入正确的手机号');
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    Alert.alert('提示', '验证码已发送');
  };

  const handleLogin = () => {
    if (!phone || !code) {
      Alert.alert('提示', '请填写完整信息');
      return;
    }
    router.push('/preschool');
  };

  const handleWechatLogin = () => {
    Alert.alert('提示', '微信登录功能开发中');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        <View style={styles.logoSection}>
          <Text style={styles.logoEmoji}>🦊</Text>
          <Text style={styles.logoText}>轻词</Text>
          <Text style={styles.logoSubtext}>QingCi</Text>
          <Text style={styles.tagline}>跟课本走，轻松记</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>手机号</Text>
            <TextInput style={styles.input} placeholder="请输入手机号" placeholderTextColor="#999"
              keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={11} />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>验证码</Text>
            <View style={styles.codeRow}>
              <TextInput style={[styles.input, styles.codeInput]} placeholder="请输入验证码"
                placeholderTextColor="#999" keyboardType="number-pad" value={code}
                onChangeText={setCode} maxLength={6} />
              <TouchableOpacity style={styles.codeButton} onPress={handleSendCode} disabled={countdown > 0}>
                <Text style={styles.codeButtonText}>{countdown > 0 ? `${countdown}s` : '获取验证码'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>登录</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.wechatBtn} onPress={handleWechatLogin}>
            <Text style={styles.wechatBtnText}>📱 微信登录</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.agreement}>
          <Text style={styles.agreementText}>
            登录即表示同意<Text style={styles.link}>《用户协议》</Text>和<Text style={styles.link}>《隐私政策》</Text>
          </Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>返回</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4ECDC4' },
  content: { flex: 1, padding: 24 },
  logoSection: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  logoEmoji: { fontSize: 80, marginBottom: 12 },
  logoText: { fontSize: 36, fontWeight: 'bold', color: '#FFF' },
  logoSubtext: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 16 },
  form: {
    backgroundColor: '#FFF', borderRadius: 20, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 16, fontSize: 16, color: '#333' },
  codeRow: { flexDirection: 'row', gap: 12 },
  codeInput: { flex: 1 },
  codeButton: { backgroundColor: '#4ECDC4', borderRadius: 12, paddingHorizontal: 16, justifyContent: 'center' },
  codeButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  loginBtn: { backgroundColor: '#4ECDC4', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  loginBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  wechatBtn: { backgroundColor: '#07C160', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 12 },
  wechatBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  agreement: { marginTop: 24, alignItems: 'center' },
  agreementText: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  link: { color: '#FFD93D' },
  backButton: { position: 'absolute', top: 50, left: 24, padding: 8 },
  backText: { fontSize: 16, color: '#FFF' },
});
