import { StyleSheet, View } from 'react-native';
import CalendarHeader from '../components/CalendarHeader';
import CalendarWeekDays from '../components/CalendarWeekDays';
import CalendarGrid from '../components/CalendarGrid';
import { getMonthYearText, type LocaleKey } from '../utils/locale';
import useCalendarState from '../hooks/useCalendarState';
import { useMemo } from 'react';

export interface CalendarProps {
  defaultDate?: Date;
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
  locale?: LocaleKey;
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const { locale, ...rest } = props;
  const {
    selectedDate,
    currentMonth,
    handleDateSelect,
    handlePrevMonth,
    handleNextMonth,
  } = useCalendarState(rest);

  const title = useMemo(() => {
    return getMonthYearText(currentMonth, locale);
  }, [currentMonth, locale]);

  return (
    <View style={styles.container}>
      {/* 달력 주/월 변경 헤더 */}
      <CalendarHeader
        title={title}
        onClickPreviousMonth={handlePrevMonth}
        onClickNextMonth={handleNextMonth}
      />

      {/* 요일 표시 */}
      <CalendarWeekDays locale={locale} />

      {/* 달력 날짜 표시 */}
      <CalendarGrid
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onSelectDate={handleDateSelect}
        onSwipeLeft={handlePrevMonth}
        onSwipeRight={handleNextMonth}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'orange',
  },
});

export default Calendar;
