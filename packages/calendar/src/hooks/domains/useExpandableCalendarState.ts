import { useCallback, useState } from 'react';
import type { ExpandableCalendarProps } from '../../calendars/ExpandableCalendar';
import useCalendarState from '../useCalendarState';

export type CalendarMode = 'month' | 'week';

/**
 * 확장 가능한 달력 상태 관리
 * - 기본 달력 상태에 모드(월/주) 전환 기능 추가
 * - 모드에 따라 월 단위 또는 주 단위 이동
 */
export function useExpandableCalendarState({
  defaultDate,
  selectedDate: controlledSelectedDate,
  onDateChange,
}: Omit<ExpandableCalendarProps, 'locale'>) {
  const baseState = useCalendarState({
    defaultDate,
    selectedDate: controlledSelectedDate,
    onDateChange,
  });

  // 달력 모드 (월/주)
  const [mode, setMode] = useState<CalendarMode>('week');

  // // 모드에 따라 적절한 핸들러 반환
  const handlePrev =
    mode === 'week' ? baseState.handlePrevWeek : baseState.handlePrevMonth;
  const handleNext =
    mode === 'week' ? baseState.handleNextWeek : baseState.handleNextMonth;

  // 모드 전환
  const updateMode = useCallback((mode: CalendarMode) => {
    setMode(mode);
  }, []);

  return {
    handleDateSelect: baseState.handleDateSelect,
    currentMonth: baseState.currentMonth,
    selectedDate: baseState.selectedDate,
    mode,
    handlePrev,
    handleNext,
    updateMode,
  };
}

export default useExpandableCalendarState;
