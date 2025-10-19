import { Text, View } from 'react-native';

interface ExpandableCalendarGridProps {
  viewMode: 'month' | 'week';
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  updateMode: (mode: 'month' | 'week') => void;
}

const ExpandableCalendarGrid = (props: ExpandableCalendarGridProps) => {
  return (
    <View>
      <Text>ExpandableCalendarGrid</Text>
    </View>
  );
};

export default ExpandableCalendarGrid;
