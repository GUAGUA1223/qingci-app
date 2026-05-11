import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fontSize, spacing } from '../../src/theme/colors';
import { speakWord, speakMeaning, stopSpeech } from '../../src/utils/speech';
import { wordImages } from '../../src/assets/images';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.6;

interface LearnScreenProps {
  route: {
    params: {
      levelId: string;
      levelName: string;
      words: any[];
    };
  };
  navigation: any;
}

export default function LearnScreen({ route, navigation }: LearnScreenProps) {
  const { levelId, levelName, words } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentWord = words[currentIndex];
  const wordKey = currentWord.word.toLowerCase();
  const imageSource = wordImages[wordKey];

  const handleSpeak = () => {
    speakWord(currentWord.word);
  };

  const handleMeaningSpeak = () => {
    speakMeaning(currentWord.meaning);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      speakMeaning(currentWord.meaning);
    }
  };

  const handleNext = () => {
    stopSpeech();
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    stopSpeech();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleComplete = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.background, '#FFF5E6']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← 返回</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{levelName}</Text>
          <Text style={styles.headerProgress}>
            {currentIndex + 1}/{words.length}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / words.length) * 100}%` },
            ]}
          />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={handleFlip}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isFlipped ? ['#A29BFE', '#81C0FF'] : ['#FFFFFF', '#F8F8F8']}
            style={styles.card}
          >
            <View style={styles.imageContainer}>
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.image}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>
                    {currentWord.word[0].toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.wordText}>
              {isFlipped ? currentWord.meaning : currentWord.word}
            </Text>
            <Text style={styles.hintText}>
              {isFlipped ? '点击查看图片' : '点击查看中文'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, styles.prevBtn]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Text style={[styles.controlText, currentIndex === 0 && styles.disabledText]}>
              ← 上一个
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.speakBtn} onPress={handleSpeak}>
            <Text style={styles.speakIcon}>🔊</Text>
            <Text style={styles.speakText}>发音</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlBtn, styles.nextBtn]}
            onPress={currentIndex === words.length - 1 ? handleComplete : handleNext}
          >
            <Text style={styles.controlText}>
              {currentIndex === words.length - 1 ? '完成 ✓' : '下一个 →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: spacing.sm,
  },
  backText: {
    fontSize: fontSize.md,
    color: colors.primary,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerProgress: {
    fontSize: fontSize.md,
    color: colors.textLight,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  cardContainer: {
    marginBottom: spacing.xl,
  },
  card: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE * 1.2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '80%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.textLight,
  },
  wordText: {
    fontSize: fontSize.xxl,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
  },
  hintText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.md,
  },
  controlBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
  },
  prevBtn: {
    backgroundColor: '#F0F0F0',
  },
  nextBtn: {
    backgroundColor: colors.primary,
  },
  controlText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  disabledText: {
    color: colors.textLight,
  },
  speakBtn: {
    alignItems: 'center',
    padding: spacing.md,
  },
  speakIcon: {
    fontSize: 32,
  },
  speakText: {
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
});
