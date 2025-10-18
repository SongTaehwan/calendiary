import {
  getToday,
  isSameDay,
  isSameMonth,
  getMonthStart,
  getWeekDay,
  addDays,
  getDaysInMonth,
} from './date';

export interface CalendarDate {
  date: Date;
  /** 현재 표시 중인 월의 날짜인지 여부 (false면 이전/다음 달 날짜) */
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

/**
 * 특정 년월에 필요한 주(week) 수를 계산
 * @param year - 표시할 년도
 * @param month - 표시할 월 (0-based: 0=1월, 11=12월)
 * @returns 필요한 주 수 (4~6)
 */
export const getWeeksInMonth = (year: number, month: number): number => {
  if (month < 0 || month > 11) {
    throw new Error(`Invalid month: ${month}`);
  }

  if (year < 0) {
    throw new Error(`Invalid year: ${year}`);
  }

  const monthStart = new Date(year, month, 1);
  const firstDayOfWeek = getWeekDay(monthStart); // 1일의 요일
  const daysInMonth = getDaysInMonth(year, month); // 해당 월의 총 일수

  // 필요한 주 수 = (첫 날의 요일 + 총 일수) / 7을 올림
  const weeksNeeded = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

  if (weeksNeeded < 4 || weeksNeeded > 6) {
    throw new Error(`Invalid weeks in month: ${weeksNeeded}`);
  }

  return weeksNeeded;
};

/**
 * 특정 년월의 달력 데이터를 생성 (필요한 주 수만큼만)
 * 이전 달과 다음 달의 날짜를 포함하여 일요일부터 토요일까지 완전한 주 단위로 구성
 *
 * @param year - 표시할 년도
 * @param month - 표시할 월 (0-based: 0=1월, 11=12월)
 * @param selectedDate - 현재 선택된 날짜 (선택 표시용)
 * @returns 배열 (필요한 주 수 x 7일)
 */
export const generateCalendarDates = (
  year: number,
  month: number,
  selectedDate?: Date
): CalendarDate[] => {
  const today = getToday();
  const currentMonthDate = new Date(year, month, 1);
  const monthStart = getMonthStart(currentMonthDate);

  // 1일의 요일 확인
  const firstDayOfWeek = getWeekDay(monthStart);

  // 달력의 시작일 계산: 1일이 일요일이 아니면 이전 달 날짜부터 시작
  const calendarStart = addDays(monthStart, -firstDayOfWeek);

  // 필요한 주 수 계산
  const weeksNeeded = getWeeksInMonth(year, month);
  const totalDays = weeksNeeded * 7;

  // 필요한 주 수만큼만 날짜 생성
  const dates: CalendarDate[] = [];

  for (let i = 0; i < totalDays; i++) {
    const date = addDays(calendarStart, i);

    dates.push({
      date,
      isCurrentMonth: isSameMonth(date, currentMonthDate),
      isToday: isSameDay(date, today),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false,
    });
  }

  return dates;
};
