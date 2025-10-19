import { StyleSheet, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, ExpandableCalendar } from '@calendiary/calendar';
import { useState } from 'react';

function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleOnDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={{ borderColor: 'red' }}>
        {/* 주-월간으로 전환 가능한 캘린더 */}
        <ExpandableCalendar
          selectedDate={selectedDate}
          onDateChange={handleOnDateChange}
        />
      </View>
      <ScrollView>
        {/* 월간 캘린더 */}
        <Calendar
          selectedDate={selectedDate}
          onDateChange={handleOnDateChange}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000000',
  },
  screenDescription: {
    fontSize: 16,
    color: '#666666',
  },
});

export default CalendarScreen;
