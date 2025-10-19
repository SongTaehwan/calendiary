export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface CalendarData {
  key: string;
  dates: CalendarDate[];
  weeksCount: number;
}
