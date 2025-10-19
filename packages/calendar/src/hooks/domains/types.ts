export interface CalendarDate {
  date: Date;
  isToday: boolean;
  isFocused: boolean;
  isSelected: boolean;
}

export interface CalendarData {
  key: string;
  dates: CalendarDate[];
  weeksCount: number;
}
