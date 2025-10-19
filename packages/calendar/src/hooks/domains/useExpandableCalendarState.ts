import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ExpandableCalendarProps } from '../../calendars/ExpandableCalendar';
import {
  addMonths,
  addWeeks,
  getToday,
  isDifferentMonthOrYear,
  startOfDay,
} from '../../utils/date';

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
  // 외부에서 날짜를 선택하지 않았을 경우, 오늘 날짜를 기본 날짜로 설정
  const [internalSelectedDate, setInternalSelectedDate] = useState<Date>(() =>
    startOfDay(defaultDate || getToday())
  );

  const isControlled = controlledSelectedDate !== undefined;

  // 외부에서 날짜를 선택했을 경우, 외부에서 선택한 날짜를 사용
  const selectedDate = useMemo(() => {
    if (isControlled) {
      return startOfDay(controlledSelectedDate);
    }

    return internalSelectedDate;
  }, [controlledSelectedDate, internalSelectedDate, isControlled]);

  // 화면 표시에 사용되는 날짜 - 헤더, 달력 모두 이 날짜를 기준으로 표시
  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  // 달력 모드 (월/주)
  const [mode, setMode] = useState<CalendarMode>('month');

  // handleDateSelect 이벤트를 통해서 날짜를 바꾸지 않고 외부에서 직접 바꾼 경우 월 데이터 업데이트
  // 예: 달력 컴포넌트 밖에서 selectedDate 값을 코드로 변경한 경우
  useEffect(() => {
    if (!isControlled) {
      return;
    }

    if (isDifferentMonthOrYear(controlledSelectedDate, currentMonth)) {
      console.log('setCurrentMonth', controlledSelectedDate);
      setCurrentMonth(controlledSelectedDate);
    }
  }, [controlledSelectedDate, isControlled]);

  // 선택된 날짜 변경 처리
  const handleDateSelect = useCallback(
    (date: Date) => {
      const normalizedDate = startOfDay(date);

      if (!isControlled) {
        setInternalSelectedDate(normalizedDate);
      }

      // 선택한 날짜가 다른 월이면 해당 월로 변경
      if (isDifferentMonthOrYear(normalizedDate, currentMonth)) {
        setCurrentMonth(normalizedDate);
      }

      if (isControlled) {
        onDateChange?.(normalizedDate);
      }
    },
    [isControlled, currentMonth, onDateChange]
  );

  // 이전 달로 이동
  const handlePrevMonth = useCallback(() => {
    console.log('prev month');
    setCurrentMonth((prev) => addMonths(prev, -1));
  }, []);

  // 다음 달로 이동
  const handleNextMonth = useCallback(() => {
    console.log('next month');
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  // 이전 주로 이동
  const handlePrevWeek = useCallback(() => {
    console.log('prev week');
    setCurrentMonth((prev) => addWeeks(prev, -1));
  }, []);

  // 다음 주로 이동
  const handleNextWeek = useCallback(() => {
    console.log('next week');
    setCurrentMonth((prev) => addWeeks(prev, 1));
  }, []);

  const handlePrevPeriod = useCallback(() => {
    if (mode === 'week') {
      console.log('handlePrevWeek');
      handlePrevWeek();
    } else {
      console.log('handlePrevMonth');
      handlePrevMonth();
    }
  }, [mode, handlePrevWeek, handlePrevMonth]);

  const handleNextPeriod = useCallback(() => {
    if (mode === 'week') {
      console.log('handleNextWeek');
      handleNextWeek();
    } else {
      console.log('handleNextMonth');
      handleNextMonth();
    }
  }, [mode, handleNextWeek, handleNextMonth]);

  // 모드 전환
  const updateMode = useCallback(
    (mode: CalendarMode) => {
      if (mode === 'month') {
        setCurrentMonth(
          new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
        );
      } else {
        setCurrentMonth(selectedDate);
      }

      setMode(mode);
    },
    [selectedDate]
  );

  return {
    mode,
    currentMonth,
    selectedDate,
    handleDateSelect,
    handlePrevPeriod,
    handleNextPeriod,
    updateMode,
  };
}

export default useExpandableCalendarState;
