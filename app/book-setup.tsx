import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '../src/theme/colors';

type Stage = 'primary' | 'middle' | 'high';

interface GradeOption {
  label: string;
  value: string;
}

const stageGrades: Record<Stage, GradeOption[]> = {
  primary: [
    { label: '一年级', value: 'grade1' },
    { label: '二年级', value: 'grade2' },
    { label: '三年级', value: 'grade3' },
    { label: '四年级', value: 'grade4' },
    { label: '五年级', value: 'grade5' },
    { label: '六年级', value: 'grade6' },
  ],
  middle: [
    { label: '七年级', value: 'grade7' },
    { label: '八年级', value: 'grade8' },
    { label: '九年级', value: 'grade9' },
  ],
  high: [
    { label: '高一', value: 'grade10' },
    { label: '高二', value: 'grade11' },
    { label: '高三', value: 'grade12' },
  ],
};

const textbookVersions: Record<Stage, string[]> = {
  primary: ['人教PEP', '北师大版', '外研社版', '苏教版'],
  middle: ['人教新目标', '北师大版', '外研社版', '译林版'],
  high: ['人教新课标', '北师大版', '外研版', '译林版'],
};

// 根据日期推断学年和学期
const getSchoolYear = () => {
  const now = new Date('2026-05-15');
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  
  // 9月-12月为第一学期，1月-8月为第二学期
  const semester = month >= 9 ? 1 : 2;
  const schoolYear = month >= 9 ? year + '-' + (year + 1) : (year - 1) + '-' + year;
  
  return { schoolYear, semester };
};

const { schoolYear, semester } = getSchoolYear();

export default function BookSetup() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleStageSelect = (stage: Stage) => {
    setSelectedStage(stage);
    setSelectedGrade(null);
    setSelectedVersion(null);
  };

  const handleGradeSelect = (grade: string) => {
    setSelectedGrade(grade);
  };

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
  };

  const handleConfirm = () => {
    if (selectedStage && selectedGrade && selectedVersion) {
      // 跳转到对应学段首页
      router.replace('/' + selectedStage);
    }
  };

  const canConfirm = selectedStage && selectedGrade && selectedVersion;

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部渐变背景 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>选课本</Text>
        <Text style={styles.headerSubtitle}>
          {schoolYear}学年 第{semester}学期
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 学段选择 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择学段</Text>
          <View style={styles.stageGrid}>
            {(['primary', 'middle', 'high'] as Stage[]).map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[
                  styles.stageCard,
                  selectedStage === stage && styles.stageCardSelected,
                ]}
                onPress={() => handleStageSelect(stage)}
                activeOpacity={0.8}
              >
                <Text style={styles.stageEmoji}>
                  {stage === 'primary' ? '🏫' : stage === 'middle' ? '📖' : '🎓'}
                </Text>
                <Text style={[
                  styles.stageLabel,
                  selectedStage === stage && styles.stageLabelSelected,
                ]}>
                  {stage === 'primary' ? '小学' : stage === 'middle' ? '初中' : '高中'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 年级选择 */}
        {selectedStage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>选择年级</Text>
            <View style={styles.gradeGrid}>
              {stageGrades[selectedStage].map((grade) => (
                <TouchableOpacity
                  key={grade.value}
                  style={[
                    styles.gradeCard,
                    selectedGrade === grade.value && styles.gradeCardSelected,
                  ]}
                  onPress={() => handleGradeSelect(grade.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.gradeLabel,
                    selectedGrade === grade.value && styles.gradeLabelSelected,
                  ]}>
                    {grade.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 版本选择 */}
        {selectedStage && selectedGrade && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>选择教材版本</Text>
            <View style={styles.versionList}>
              {textbookVersions[selectedStage].map((version) => (
                <TouchableOpacity
                  key={version}
                  style={[
                    styles.versionCard,
                    selectedVersion === version && styles.versionCardSelected,
                  ]}
                  onPress={() => handleVersionSelect(version)}
                  activeOpacity={0.8}
                >
                  <View style={styles.versionRadio}>
                    {selectedVersion === version && (
                      <View style={styles.versionRadioInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.versionLabel,
                    selectedVersion === version && styles.versionLabelSelected,
                  ]}>
                    {version}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 占位 */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* 确认按钮 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !canConfirm && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!canConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>开始学习</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FFFE',
  },
  header: {
    backgroundColor: colors.primary.primary,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  stageGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  stageCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  stageCardSelected: {
    backgroundColor: colors.primary.primary,
  },
  stageEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  stageLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  stageLabelSelected: {
    color: '#FFFFFF',
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gradeCard: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  gradeCardSelected: {
    backgroundColor: colors.primary.secondary,
  },
  gradeLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  gradeLabelSelected: {
    color: '#FFFFFF',
  },
  versionList: {
    gap: 10,
  },
  versionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  versionCardSelected: {
    backgroundColor: '#E8FEF9',
    borderWidth: 1,
    borderColor: colors.primary.primary,
  },
  versionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  versionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.primary,
  },
  versionLabel: {
    fontSize: 16,
    color: '#333333',
  },
  versionLabelSelected: {
    color: colors.primary.primary,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: colors.primary.primary,
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#CCC',
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
