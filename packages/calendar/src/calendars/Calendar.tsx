import { StyleSheet, View } from 'react-native';
import CalendarHeader from '../components/CalendarHeader';
import CalendarWeekDays from '../components/CalendarWeekDays';
import { type LocaleKey } from '../utils/locale';
import CalendarBody from '../components/CalendarBody';
import useCalendarState from '../hooks/useCalendarState';
import { useMemo } from 'react';
import { generateCalendarDates } from '../utils/calendar';

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

  // 현재 월의 달력 데이터 생성 (동적: 4~6주)
  // 선택된 날짜는 바뀌지 않아도 월 달력 데이터는 변경되어야 함
  const calendarDates = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return generateCalendarDates(year, month, selectedDate);
  }, [selectedDate, currentMonth]);

  return (
    <View style={styles.container}>
      {/* 달력 주/월 변경 헤더 */}
      <CalendarHeader
        month={currentMonth}
        onClickPreviousMonth={handlePrevMonth}
        onClickNextMonth={handleNextMonth}
        locale={locale}
      />

      {/* 요일 표시 */}
      <CalendarWeekDays locale={locale} />

      {/* 달력 날짜 표시 */}
      <CalendarBody
        dates={calendarDates}
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
