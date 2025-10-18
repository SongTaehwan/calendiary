// 개별 날짜 셀 컴포넌트

import React, { useCallback } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import type { CalendarDate } from '../utils/calendar';

interface DayProps {
  calendarDate: CalendarDate;
  onPress: (date: Date) => void;
}

/**
 * 날짜 셀 컴포넌트
 */
export const Day: React.FC<DayProps> = ({ calendarDate, onPress }) => {
  const { date, isCurrentMonth, isToday, isSelected } = calendarDate;

  const handlePress = useCallback(() => {
    onPress(date);
  }, [date, onPress]);

  const textStyle = [
    styles.text,
    !isCurrentMonth && styles.otherMonthText, // 다른 월 날짜는 흐리게
    isToday && styles.todayText, // 오늘 날짜는 파란색
    isSelected && styles.selectedText, // 선택된 날짜는 흰색
  ];

  return (
    <Pressable
      style={styles.container}
      onPress={handlePress}
      android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
    >
      <View style={isSelected ? styles.selected : undefined}>
        <Text style={textStyle}>{date.getDate()}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    width: '60%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 100,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  otherMonthText: {
    color: '#C7C7CC',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  selectedText: {
    fontWeight: '600',
  },
});

export default Day;
