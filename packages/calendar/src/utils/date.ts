/**
 * 로컬 시간 기준으로 처리
 * @param date 날짜
 * @return 날짜 0 시 0 분 0 초 0 밀리초
 */
export const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * 오늘 날짜 반환
 * @return 오늘 날짜 (로컬 시간 기준) 0 시 0 분 0 초 0 밀리초
 */
export const getToday = (): Date => {
  return startOfDay(new Date());
};

/**
 * 특정 년월의 일수 반환 (윤년 고려)
 * @param year 년도
 * @param month 월 (0-based: 0=1월, 11=12월)
 * @returns 해당 월의 일수 (28~31)
 */
export const getDaysInMonth = (year: number, month: number): number => {
  if (month < 0 || month > 11) {
    throw new Error(`Invalid month: ${month}`);
  }

  if (year < 0) {
    throw new Error(`Invalid year: ${year}`);
  }

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 1 && isLeapYear(year)) {
    return 29; // 2월 윤년
  }

  return daysInMonth[month] ?? 31; // 기본값 31일
};

/**
 * 0: 일요일, 1: 월요일, 2: 화요일, 3: 수요일, 4: 목요일, 5: 금요일, 6: 토요일
 */
export const getWeekDay = (date: Date): number => {
  return date.getDay();
};

/**
 * 월 시작 날짜 반환 (x월 1일)
 * @param date 날짜
 * @return 월 시작 날짜 (로컬 시간 기준) 0 시 0 분 0 초 0 밀리초
 */
export const getMonthStart = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setDate(1);
  return startOfDay(newDate);
};

/**
 * 일 단위로 날짜 변경
 */
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return startOfDay(newDate);
};

/**
 * 주 단위로 날짜 변경
 */
export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

/**
 * 월 단위로 날짜 변경
 */
export const addMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  const targetMonth = newDate.getMonth() + months;
  newDate.setMonth(targetMonth);

  if (newDate.getMonth() !== (((date.getMonth() + months) % 12) + 12) % 12) {
    newDate.setDate(0); // 이전 달의 마지막 날로 설정
  }

  return startOfDay(newDate);
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameMonth = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

// 윤년 여부 확인
export const isLeapYear = (year: number): boolean => {
  if (year < 0) {
    throw new Error(`Invalid year: ${year}`);
  }

  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
