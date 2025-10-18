// 로컬 시간 기준으로 처리
export const startOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// 오늘 날짜 반환
export const getToday = (): Date => {
  return startOfDay(new Date());
};

// 0: 일요일, 1: 월요일, 2: 화요일, 3: 수요일, 4: 목요일, 5: 금요일, 6: 토요일
export const getWeekDay = (date: Date): number => {
  return date.getDay();
};

// 일 단위로 날짜 변경
export const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return startOfDay(newDate);
};

// 주 단위로 날짜 변경
export const addWeeks = (date: Date, weeks: number): Date => {
  return addDays(date, weeks * 7);
};

// 월 단위로 날짜 변경
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
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
