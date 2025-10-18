import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from '@calendiary/calendar';
import { useState } from 'react';

function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleOnDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ScrollView>
        <Calendar
          selectedDate={selectedDate}
          onDateChange={handleOnDateChange}
        />
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
