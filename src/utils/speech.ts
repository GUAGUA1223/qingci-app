import * as Speech from 'expo-speech';

// 标记是否正在播放
let isSpeakingFlag = false;

export function speakPreschool(word: string) {
  if (!word) return;
  Speech.stop();
  isSpeakingFlag = true;
  Speech.speak(word, {
    language: 'en-US',
    rate: 0.7,  // 慢一点，适合幼儿
    pitch: 1.0, // 正常音调，不要太高
    volume: 1.0,
    onDone: () => {
      isSpeakingFlag = false;
    },
    onError: () => {
      isSpeakingFlag = false;
    },
    onStopped: () => {
      isSpeakingFlag = false;
    },
  });
}

export function speakPrimary(word: string) {
  if (!word) return;
  Speech.stop();
  isSpeakingFlag = true;
  Speech.speak(word, {
    language: 'en-US',
    rate: 0.85,
    pitch: 1.0,
    volume: 1.0,
    onDone: () => {
      isSpeakingFlag = false;
    },
    onError: () => {
      isSpeakingFlag = false;
    },
    onStopped: () => {
      isSpeakingFlag = false;
    },
  });
}

export function speakNormal(word: string) {
  if (!word) return;
  Speech.stop();
  isSpeakingFlag = true;
  Speech.speak(word, {
    language: 'en-US',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    onDone: () => {
      isSpeakingFlag = false;
    },
    onError: () => {
      isSpeakingFlag = false;
    },
    onStopped: () => {
      isSpeakingFlag = false;
    },
  });
}

export function stopSpeaking() {
  Speech.stop();
  isSpeakingFlag = false;
}

// 获取当前是否正在播放
export function isSpeaking(): boolean {
  return isSpeakingFlag;
}

// 播放鼓励音 - 使用文字转语音模拟
export function playEncourage() {
  speakNormal('Great!');
}

// 播放错误提示音 - 使用文字转语音模拟
export function playWrong() {
  speakNormal('Try again');
}
