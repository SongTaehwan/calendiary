import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CalendarProps } from '../calendars/Calendar';
import { addMonths, getToday, startOfDay } from '../utils/date';

const useCalendarState = ({
  defaultDate,
  selectedDate: controlledSelectedDate,
  onDateChange,
}: Exclude<CalendarProps, 'locale'>) => {
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

  // 현재 표시 중인 월 (선택된 날짜 기준) - 헤더에서 참조
  const [currentMonth, setCurrentMonth] = useState<Date>(
    () => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  // handleDateSelect 이벤트를 통해서 날짜를 바꾸지 않고 외부에서 직접 바꾼 경우 월 데이터 업데이트
  // 예: 달력 컴포넌트 밖에서 selectedDate 값을 코드로 변경한 경우
  useEffect(() => {
    if (!isControlled) {
      return;
    }

    if (
      controlledSelectedDate.getMonth() !== currentMonth.getMonth() ||
      controlledSelectedDate.getFullYear() !== currentMonth.getFullYear()
    ) {
      setCurrentMonth(
        new Date(
          controlledSelectedDate.getFullYear(),
          controlledSelectedDate.getMonth(),
          1
        )
      );
    }
  }, [controlledSelectedDate]);

  // 선택된 날짜 변경 처리
  const handleDateSelect = useCallback(
    (date: Date) => {
      const normalizedDate = startOfDay(date);

      if (!isControlled) {
        setInternalSelectedDate(normalizedDate);
      }

      // 선택한 날짜가 다른 월이면 해당 월로 변경
      if (
        normalizedDate.getMonth() !== currentMonth.getMonth() ||
        normalizedDate.getFullYear() !== currentMonth.getFullYear()
      ) {
        setCurrentMonth(
          new Date(normalizedDate.getFullYear(), normalizedDate.getMonth(), 1)
        );
      }

      if (isControlled) {
        onDateChange?.(normalizedDate);
      }
    },
    [isControlled, currentMonth, onDateChange]
  );

  // 이전 달로 이동
  const handlePrevMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, -1));
  }, []);

  // 다음 달로 이동
  const handleNextMonth = useCallback(() => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  }, []);

  return {
    selectedDate,
    currentMonth,
    handleDateSelect,
    handlePrevMonth,
    handleNextMonth,
  };
};

export default useCalendarState;
