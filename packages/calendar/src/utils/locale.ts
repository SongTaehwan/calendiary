type LocaleConfiguration = {
  weekDayText: string[];
  monthText: string[];
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

  if (locale === SupportedLanguage.KO) {
    return `${year}년 ${month}월`;
  }

  return `${localeConfig.monthText[month]} ${year}`;
};
