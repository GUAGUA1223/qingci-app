import * as Speech from 'expo-speech';

// 学前阶段语速稍快
const PRESCHOOL_RATE = 0.8;

export const speakWord = async (word: string, lang: string = 'en-US') => {
  try {
    await Speech.speak(word, {
      language: lang,
      rate: PRESCHOOL_RATE,
      pitch: 1.1,
    });
  } catch (error) {
    console.error('Speech error:', error);
  }
};

export const speakMeaning = async (meaning: string) => {
  try {
    await Speech.speak(meaning, {
      language: 'zh-CN',
      rate: 0.7,
      pitch: 1.0,
    });
  } catch (error) {
    console.error('Speech error:', error);
  }
};

export const stopSpeech = () => {
  Speech.stop();
};
