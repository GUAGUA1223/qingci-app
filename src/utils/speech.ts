import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import CryptoJS from 'crypto-js';

// 有道智云 API 配置
const YOUDAO_APP_KEY = '143abc023b68c259';
const YOUDAO_APP_SECRET = 'UYmxyBSTo3Jk6TrGXI6uh9Yu94LkWCQA';
const YOUDAO_TTS_URL = 'https://openapi.youdao.com/ttsapi';

// 生成有道TTS签名
function generateSign(q: string, appKey: string, salt: string, curtime: string, secret: string): string {
  const input = q.length > 20 ? q.substring(0, 10) + q.length + q.substring(q.length - 10) : q;
  const signStr = appKey + input + salt + curtime + secret;
  
  // SHA256 签名
  const sign = CryptoJS.SHA256(signStr).toString();
  return sign;
}

// 有道TTS发音
async function speakWithYoudao(word: string, speed: number = 1): Promise<boolean> {
  try {
    const salt = Date.now().toString();
    const curtime = Math.floor(Date.now() / 1000).toString();
    const sign = generateSign(word, YOUDAO_APP_KEY, salt, curtime, YOUDAO_APP_SECRET);
    
    const formData = new FormData();
    formData.append('q', word);
    formData.append('appKey', YOUDAO_APP_KEY);
    formData.append('salt', salt);
    formData.append('sign', sign);
    formData.append('signType', 'v3');
    formData.append('curtime', curtime);
    formData.append('format', 'mp3');
    formData.append('speed', speed.toString());
    formData.append('volume', '1');
    formData.append('voiceName', 'youxiaoqin');

    const response = await fetch(YOUDAO_TTS_URL, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type') || '';
      
      // 如果返回的是JSON（错误），则失败
      if (contentType.includes('application/json')) {
        const json = await response.json();
        console.log('有道TTS错误:', json);
        return false;
      }
      
      // 返回的是音频文件
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.playAsync();
      
      // 播放完成后清理
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          URL.revokeObjectURL(url);
        }
      });
      return true;
    }
    return false;
  } catch (error) {
    console.log('有道TTS失败:', error);
    return false;
  }
}

// Fallback 到 expo-speech
function fallbackToExpoSpeech(word: string) {
  Speech.stop();
  Speech.speak(word, {
    language: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  });
}

// 学前发音
export async function speakPreschool(word: string): Promise<void> {
  const success = await speakWithYoudao(word, 1);
  if (!success) {
    fallbackToExpoSpeech(word);
  }
}

// 小学发音
export async function speakPrimary(word: string): Promise<void> {
  const success = await speakWithYoudao(word, 1);
  if (!success) {
    fallbackToExpoSpeech(word);
  }
}

// 初高中发音
export async function speakNormal(word: string): Promise<void> {
  const success = await speakWithYoudao(word, 1);
  if (!success) {
    fallbackToExpoSpeech(word);
  }
}

// 停止发音
export function stopSpeaking(): void {
  Speech.stop();
}

// 播放鼓励
export async function playEncourage(): Promise<void> {
  await speakWithYoudao('Great job!', 1);
}

// 播放错误
export async function playWrong(): Promise<void> {
  await speakWithYoudao('Try again!', 1);
}
