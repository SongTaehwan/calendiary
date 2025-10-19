import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import type { CalendarDate } from '../hooks/domains/types';
import Day from './Day';

interface WeekProps {
  style?: StyleProp<ViewStyle>;
  days: CalendarDate[];
  onSelectDate: (date: Date) => void;
}

const Week = ({ days, onSelectDate, style }: WeekProps) => {
  return (
    <View style={[styles.container, style]}>
      {days.map((calendarDate, dayIndex) => (
        <Day
          key={`${calendarDate.date.toDateString()}-${dayIndex}`}
          calendarDate={calendarDate}
          onPress={onSelectDate}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default Week;
