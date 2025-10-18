import { useMemo } from 'react';
import { generateCalendarDates, type CalendarDate } from '../../utils/calendar';
import { addMonths } from '../../utils/date';

interface MonthData {
  key: string;
  dates: CalendarDate[];
  weeksCount: number;
}

interface UseCalendarMonthsDataProps {
  currentMonth: Date;
  selectedDate: Date;
}

/**
 * 이전/현재/다음 3개월의 달력 데이터 생성
 * - 무한 스크롤 패턴을 위한 3개월 데이터
 * - 내부에서 모든 월의 데이터를 생성 (데이터 생성 책임 집중)
 */
const useCalendarMonthsData = ({
  currentMonth,
  selectedDate,
}: UseCalendarMonthsDataProps): MonthData[] => {
  return useMemo(() => {
    const prevMonth = addMonths(currentMonth, -1);
    const nextMonth = addMonths(currentMonth, 1);

    const prevMonthDates = generateCalendarDates(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      selectedDate
    );

    const currentMonthDates = generateCalendarDates(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      selectedDate
    );

    const nextMonthDates = generateCalendarDates(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      selectedDate
    );

    return [
      {
        key: `${prevMonth.getFullYear()}-${prevMonth.getMonth()}`,
        dates: prevMonthDates,
        weeksCount: prevMonthDates.length / 7,
      },
      {
        key: `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`,
        dates: currentMonthDates,
        weeksCount: currentMonthDates.length / 7,
      },
      {
        key: `${nextMonth.getFullYear()}-${nextMonth.getMonth()}`,
        dates: nextMonthDates,
        weeksCount: nextMonthDates.length / 7,
      },
    ];
  }, [currentMonth, selectedDate]);
};

export default useCalendarMonthsData;
