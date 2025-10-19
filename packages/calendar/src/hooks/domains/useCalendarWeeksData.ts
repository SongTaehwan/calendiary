import { useMemo } from 'react';
import { generateWeekCalendarDates } from '../../utils/calendar';
import { addWeeks, getWeekStart } from '../../utils/date';
import type { CalendarData } from './types';

interface UseCalendarWeeksDataProps {
  selectedDate: Date;
}

/**
 * 이전/현재/다음 주의 달력 데이터 생성
 */
const useCalendarWeeksData = ({
  selectedDate,
}: UseCalendarWeeksDataProps): CalendarData[] => {
  return useMemo(() => {
    const weekStart = getWeekStart(selectedDate);
    const prevWeek = addWeeks(weekStart, -1);
    const nextWeek = addWeeks(weekStart, 1);

    const prevWeekDates = generateWeekCalendarDates(prevWeek, selectedDate);
    const currentWeekDates = generateWeekCalendarDates(weekStart, selectedDate);
    const nextWeekDates = generateWeekCalendarDates(nextWeek, selectedDate);

    return [
      {
        key: prevWeek.toISOString(),
        dates: prevWeekDates,
        weeksCount: 1,
      },
      {
        key: weekStart.toISOString(),
        dates: currentWeekDates,
        weeksCount: 1,
      },
      {
        key: nextWeek.toISOString(),
        dates: nextWeekDates,
        weeksCount: 1,
      },
    ];
  }, [selectedDate]);
};

export default useCalendarWeeksData;
