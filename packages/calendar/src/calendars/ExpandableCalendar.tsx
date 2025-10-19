import { StyleSheet, View } from 'react-native';
import {
  getMonthYearText,
  getWeekOfMonthTextWithYear,
  type LocaleKey,
} from '../utils/locale';
import CalendarHeader from '../components/CalendarHeader';
import CalendarWeekDays from '../components/CalendarWeekDays';
import useExpandableCalendarState from '../hooks/domains/useExpandableCalendarState';
import { useCallback, useMemo } from 'react';
import ExpandableCalendarGrid from '../components/ExpandableCalendarGrid';

export interface ExpandableCalendarProps {
  defaultDate?: Date;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  locale?: LocaleKey;
}

/**
 * 확장 가능한 달력 컴포넌트
 * - 월 달력 모드: 전체 월 표시 & 월 단위 이동
 * - 주 달력 모드: 선택된 주만 표시 & 주 단위 이동
 * - 수직 스와이프로 모드 전환
 */
const ExpandableCalendar = (props: ExpandableCalendarProps) => {
  const { locale, ...rest } = props;
  const {
    selectedDate,
    currentMonth,
    mode,
    handleDateSelect,
    handlePrevPeriod,
    handleNextPeriod,
    updateMode,
  } = useExpandableCalendarState(rest);

  const title = useMemo(() => {
    if (mode === 'month') {
      return getMonthYearText(currentMonth, locale);
    }

    return getWeekOfMonthTextWithYear(currentMonth, locale);
  }, [currentMonth, locale, mode]);

  const handleSwipeDown = useCallback(() => {
    updateMode('month');
  }, [updateMode]);

  const handleSwipeUp = useCallback(() => {
    updateMode('week');
  }, [updateMode]);

  return (
    <View style={styles.container}>
      {/* 달력 헤더 (월/주 이동 버튼 포함) */}
      <CalendarHeader
        title={title}
        onClickPreviousMonth={handlePrevPeriod}
        onClickNextMonth={handleNextPeriod}
      />

      {/* 요일 표시 */}
      <CalendarWeekDays locale={locale} />

      {/* 확장 가능한 달력 그리드 */}
      <ExpandableCalendarGrid
        viewMode={mode}
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        onSwipeLeft={handlePrevPeriod}
        onSwipeRight={handleNextPeriod}
        onSwipeUp={handleSwipeUp}
        onSwipeDown={handleSwipeDown}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'orange',
  },
});

export default ExpandableCalendar;
