import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { foxImages } from '../assets/images';

const ADMIN_ACCOUNT = 'admin';
const ADMIN_PASSWORD = 'qingci2026';

export default function LoginScreen() {
  const router = useRouter();
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!account || !password) {
      Alert.alert('提示', '请输入账号和密码');
      return;
    }

    if (account === ADMIN_ACCOUNT && password === ADMIN_PASSWORD) {
      router.replace('/');
    } else {
      Alert.alert('登录失败', '账号或密码错误');
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 顶部小狐狸图片占屏30% */}
          <View style={styles.headerImage}>
            <Image
              source={foxImages.excited}
              style={styles.foxImage}
              resizeMode="contain"
            />
          </View>

          {/* 品牌名 */}
          <View style={styles.brandSection}>
            <Text style={styles.brandText}>轻词</Text>
            <Text style={styles.brandSubtext}>QingCi</Text>
          </View>

          {/* 卡片区域 */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>管理员登录</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>管理员账号</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入账号"
                placeholderTextColor="#999"
                value={account}
                onChangeText={setAccount}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>密码</Text>
              <TextInput
                style={styles.input}
                placeholder="请输入密码"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>登 录</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backText}>返回</Text>
            </TouchableOpacity>
          </View>

          {/* 底部协议 */}
          <Text style={styles.agreementText}>登录即同意《用户协议》和《隐私政策》</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  headerImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#FFF5F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  foxImage: {
    width: 200,
    height: 200,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF9ECD',
  },
  brandSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#FF9ECD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#FFE5EF',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#FFF5F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#FFE5EF',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#4ECDC4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  backText: {
    fontSize: 14,
    color: '#FF9ECD',
  },
  agreementText: {
    fontSize: 11,
    color: '#CCC',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
});
