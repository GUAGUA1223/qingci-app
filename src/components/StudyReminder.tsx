import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { colors } from '../theme/colors';
import { FoxMascot } from './FoxMascot';

interface StudyReminderProps {
  visible: boolean;
  onClose: () => void;
  onConfirm?: (reminderTime: string) => void;
  lastStudyDays?: number;
}

export const StudyReminder: React.FC<StudyReminderProps> = ({
  visible,
  onClose,
  onConfirm,
  lastStudyDays = 3,
}) => {
  const [selectedHour, setSelectedHour] = useState('20');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutes = ['00', '15', '30', '45'];

  const handleConfirm = () => {
    const time = selectedHour + ':' + selectedMinute;
    onConfirm?.(time);
    onClose();
  };

  const getMessage = () => {
    if (lastStudyDays >= 7) {
      return '好几天没见面啦';
    } else if (lastStudyDays >= 3) {
      return '想你了~';
    } else {
      return '好久不见';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.foxContainer}>
            <FoxMascot size={80} mood="hungry" />
          </View>

          <Text style={styles.title}>🦊 {getMessage()}</Text>

          <Text style={styles.subtitle}>
            小狐狸想和你一起学单词
          </Text>

          <View style={styles.timeSelector}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>时</Text>
              <View style={styles.timeGrid}>
                {hours.slice(0, 12).map(hour => (
                  <TouchableOpacity
                    key={hour}
                    style={[
                      styles.timeButton,
                      selectedHour === hour && styles.timeButtonSelected,
                    ]}
                    onPress={() => setSelectedHour(hour)}
                  >
                    <Text style={[
                      styles.timeText,
                      selectedHour === hour && styles.timeTextSelected,
                    ]}>
                      {hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            <View style={styles.timeColumn}>
              <Text style={styles.timeLabel}>分</Text>
              <View style={styles.timeGridSmall}>
                {minutes.map(minute => (
                  <TouchableOpacity
                    key={minute}
                    style={[
                      styles.timeButtonSmall,
                      selectedMinute === minute && styles.timeButtonSelected,
                    ]}
                    onPress={() => setSelectedMinute(minute)}
                  >
                    <Text style={[
                      styles.timeText,
                      selectedMinute === minute && styles.timeTextSelected,
                    ]}>
                      {minute}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelText}>不了，谢谢</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmText}>提醒我</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  foxContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  timeColumn: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 120,
    gap: 4,
  },
  timeGridSmall: {
    gap: 4,
  },
  timeButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonSmall: {
    width: 50,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: colors.primary.primary,
  },
  timeText: {
    fontSize: 14,
    color: '#333333',
  },
  timeTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timeSeparator: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 18,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#666666',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary.primary,
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
