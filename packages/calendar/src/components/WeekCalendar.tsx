import { FlatList, StyleSheet, useWindowDimensions, View } from 'react-native';
import useInfiniteHorizontalScroll from '../hooks/utils/useInfiniteHorizontalScroll';
import useCalendarWeeksData from '../hooks/domains/useCalendarWeeksData';
import { useMemo, useRef } from 'react';
import type { CalendarData } from '../hooks/domains/types';
import Day from './Day';

interface WeekCalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSelectDate: (date: Date) => void;
}

const WeekCalendar = ({
  currentMonth,
  selectedDate,
  onSwipeLeft,
  onSwipeRight,
  onSelectDate,
}: WeekCalendarProps) => {
  const { width: calendarWidth } = useWindowDimensions();
  const weekCalendarRef = useRef<FlatList>(null);

  // 주간 달력 데이터
  const weeksData = useCalendarWeeksData({
    currentMonth,
    selectedDate,
  });

  const {
    handleMomentumScrollEnd: handleMomentumScrollEndWeek,
    handleGetItemLayout: handleGetItemLayoutWeek,
  } = useInfiniteHorizontalScroll({
    itemWidth: calendarWidth,
    scrollableRef: weekCalendarRef,
    onScrollToPrev: onSwipeLeft,
    onScrollToNext: onSwipeRight,
  });

  const renderWeekCalendarItem = useMemo(
    () =>
      ({ item }: { item: CalendarData }) => {
        const { key: weekKey, dates: weekDates } = item;

        return (
          <View
            style={[styles.weekCalendarContainer, { width: calendarWidth }]}
          >
            <View style={styles.weekContainer}>
              {weekDates.map((calendarDate, dayIndex) => {
                const dayKey = `${weekKey}-day-${dayIndex}`;
                return (
                  <Day
                    key={dayKey}
                    calendarDate={calendarDate}
                    onPress={onSelectDate}
                  />
                );
              })}
            </View>
          </View>
        );
      },
    [calendarWidth, onSelectDate]
  );

  return (
    <FlatList
      ref={weekCalendarRef}
      data={weeksData}
      renderItem={renderWeekCalendarItem}
      keyExtractor={(item) => item.key}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      onMomentumScrollEnd={handleMomentumScrollEndWeek}
      getItemLayout={handleGetItemLayoutWeek}
      initialScrollIndex={1}
      decelerationRate={'fast'}
      bounces={false}
      removeClippedSubviews={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'green',
  },
  monthCalendarContainer: {},
  weekCalendarContainer: {},
  weekContainer: {
    flexDirection: 'row',
  },
});

export default WeekCalendar;
