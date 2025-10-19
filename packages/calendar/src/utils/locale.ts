import { getWeekIndexInMonth, getWeekOfMonth } from './calendar';

type LocaleConfiguration = {
  weekDayText: string[];
  monthText: string[];
  weekOfMonthText: string[];
};

export enum SupportedLanguage {
  KO = 'ko',
  EN = 'en',
}

export type LocaleKey = SupportedLanguage | string;

export const LocaleConfig: Record<string, LocaleConfiguration> = {
  [SupportedLanguage.KO]: {
    weekDayText: ['일', '월', '화', '수', '목', '금', '토'],
    monthText: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    weekOfMonthText: ['1주차', '2주차', '3주차', '4주차', '5주차', '6주차'],
  },
  [SupportedLanguage.EN]: {
    weekDayText: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    monthText: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    weekOfMonthText: [
      '1st week',
      '2nd week',
      '3rd week',
      '4th week',
      '5th week',
      '6th week',
    ],
  },
};

export const getLocaleConfig = (
  locale: LocaleKey = SupportedLanguage.KO
): LocaleConfiguration => {
  const config = LocaleConfig[locale];

  if (!config) {
    console.warn(`Locale config not found for locale: ${locale}`);
    return LocaleConfig[SupportedLanguage.KO]!;
  }

  return config;
};

export const getMonthYearText = (
  date: Date,
  locale: LocaleKey = SupportedLanguage.KO
): string => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const localeConfig = getLocaleConfig(locale);
  const monthText = localeConfig.monthText[month];

  if (locale === SupportedLanguage.KO) {
    return `${year}년 ${monthText}`;
  }

  return `${monthText} ${year}`;
};

export const getWeekOfMonthText = (
  date: Date,
  locale: LocaleKey = SupportedLanguage.KO
): string => {
  const localeConfig = getLocaleConfig(locale);
  const weekIndexOfMonth = getWeekIndexInMonth(date);

  if (
    weekIndexOfMonth > localeConfig.weekOfMonthText.length - 1 ||
    weekIndexOfMonth < 0
  ) {
    throw new Error('Week of month is out of range');
  }

  const weekText = localeConfig.weekOfMonthText[weekIndexOfMonth];
  return weekText!;
};

export const getWeekOfMonthTextWithYear = (
  date: Date,
  locale: LocaleKey = SupportedLanguage.KO
): string => {
  const monthYearText = getMonthYearText(date, locale);
  const weekOfMonthText = getWeekOfMonthText(date, locale);

  if (locale === SupportedLanguage.KO) {
    return `${monthYearText} ${weekOfMonthText}`;
  }

  return `The ${weekOfMonthText} of ${monthYearText}`;
};

export const getWeekDayNames = (
  locale: LocaleKey = SupportedLanguage.KO
): string[] => {
  const localeConfig = getLocaleConfig(locale);
  return localeConfig.weekDayText;
};
