import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getWeekDayNames, type LocaleKey } from '../utils/locale';

interface CalendarWeekDaysProps {
  locale?: LocaleKey;
}

/**
 * 요일 표시 컴포넌트 (일요일부터 시작)
 * - 일요일은 빨간색, 토요일은 파란색으로 표시
 */
export const CalendarWeekDays: React.FC<CalendarWeekDaysProps> = ({
  locale,
}) => {
  const weekDayNames = getWeekDayNames(locale);

  return (
    <View style={styles.container}>
      {weekDayNames.map((dayName, index) => (
        <View key={`${dayName}-${index}`} style={styles.dayContainer}>
          <Text
            style={[
              styles.dayText,
              index === 0 && styles.sundayText, // 일요일 빨간색
              index === 6 && styles.saturdayText, // 토요일 파란색
            ]}
          >
            {dayName}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  dayContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  sundayText: {
    color: '#FF3B30',
  },
  saturdayText: {
    color: '#007AFF',
  },
});

export default CalendarWeekDays;
