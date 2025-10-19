import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface CalendarHeaderProps {
  title: string;
  onClickPreviousMonth: () => void;
  onClickNextMonth: () => void;
}

/**
 * 달력 헤더 컴포넌트
 * - 년월 텍스트 표시
 * - 이전/다음 달 이동 버튼
 */
export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  title,
  onClickPreviousMonth,
  onClickNextMonth,
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={onClickPreviousMonth}
        hitSlop={8}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)', borderless: true }}
      >
        <Text style={styles.buttonText}>‹</Text>
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <Pressable
        style={styles.button}
        onPress={onClickNextMonth}
        hitSlop={8}
        android_ripple={{ color: 'rgba(0, 0, 0, 0.1)', borderless: true }}
      >
        <Text style={styles.buttonText}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
});

export default CalendarHeader;
