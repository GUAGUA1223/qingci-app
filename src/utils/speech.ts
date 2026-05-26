import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import CryptoJS from 'crypto-js';
import * as FileSystem from 'expo-file-system';

// 有道智云 API 配置
const YOUDAO_APP_KEY = '143abc023b68c259';
const YOUDAO_APP_SECRET = 'UYmxyBSTo3Jk6TrGXI6uh9Yu94LkWCQA';
const YOUDAO_TTS_URL = 'https://openapi.youdao.com/ttsapi';

// 生成有道TTS签名
function generateSign(q: string, appKey: string, salt: string, curtime: string, secret: string): string {
  const input = q.length > 20 ? q.substring(0, 10) + q.length + q.substring(q.length - 10) : q;
  const signStr = appKey + input + salt + curtime + secret;
  const sign = CryptoJS.SHA256(signStr).toString();
  return sign;
}

// 有道TTS发音（React Native兼容版）
async function speakWithYoudao(word: string, speed: number = 1): Promise<boolean> {
  try {
    const salt = Date.now().toString();
    const curtime = Math.floor(Date.now() / 1000).toString();
    const sign = generateSign(word, YOUDAO_APP_KEY, salt, curtime, YOUDAO_APP_SECRET);

    // 有道TTS GET请求方式（更简单可靠）
    const url = `${YOUDAO_TTS_URL}?q=${encodeURIComponent(word)}&appKey=${YOUDAO_APP_KEY}&salt=${salt}&sign=${sign}&signType=v3&curtime=${curtime}&voiceName=youxiaoqin&format=mp3&speed=${speed}&volume=1`;

    // 下载音频到本地临时文件（React Native方式）
    const localUri = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`;
    const downloadResult = await FileSystem.downloadAsync(url, localUri);

    if (downloadResult.uri) {
      const { sound } = await Audio.Sound.createAsync({ uri: downloadResult.uri });
      await sound.playAsync();

      // 播放完成后清理
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          // 删除临时文件
          FileSystem.deleteAsync(downloadResult.uri, { idempotent: true }).catch(() => {});
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

// 学前发音（慢速，适合幼儿）
export async function speakPreschool(word: string): Promise<void> {
  const success = await speakWithYoudao(word, 0.8);
  if (!success) {
    Speech.stop();
    Speech.speak(word, { language: 'en-US', rate: 0.8, pitch: 1.1, volume: 1.0 });
  }
}

// 小学发音
export async function speakPrimary(word: string): Promise<void> {
  const success = await speakWithYoudao(word, 0.9);
  if (!success) {
    Speech.stop();
    Speech.speak(word, { language: 'en-US', rate: 0.9, pitch: 1.1, volume: 1.0 });
  }
}

// 初高中发音
export async function speakNormal(word: string): Promise<void> {
  const success = await speakWithYoudao(word, 1.0);
  if (!success) {
    Speech.stop();
    Speech.speak(word, { language: 'en-US', rate: 1.0, pitch: 1.0, volume: 1.0 });
  }
}

// 停止发音
export function stopSpeaking(): void {
  Speech.stop();
}

// 播放鼓励
export async function playEncourage(): Promise<void> {
  const success = await speakWithYoudao('Great job!', 1);
  if (!success) {
    Speech.speak('Great job!', { language: 'en-US', rate: 1.0 });
  }
}

// 播放错误提示
export async function playWrong(): Promise<void> {
  const success = await speakWithYoudao('Try again!', 1);
  if (!success) {
    Speech.speak('Try again!', { language: 'en-US', rate: 1.0 });
  }
}
