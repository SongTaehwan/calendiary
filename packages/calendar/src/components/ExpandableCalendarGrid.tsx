import { useMemo, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

// domain hooks
import { type CalendarData, type CalendarDate } from '../hooks/domains/types';
import useCalendarMonthsData from '../hooks/domains/useCalendarMonthsData';
import useCalendarHeight from '../hooks/domains/useCalendarHeight';
import useCalendarWeeksData from '../hooks/domains/useCalendarWeeksData';

// utility hooks
import useAnimatedHeightTransition from '../hooks/utils/useAnimatedHeightTransition';
import useInfiniteHorizontalScroll from '../hooks/utils/useInfiniteHorizontalScroll';
import useVerticalSwipeGesture from '../hooks/utils/useVerticalSwipeGesture';

// components
import Day from './Day';

interface ExpandableCalendarGridProps {
  viewMode: 'month' | 'week';
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  updateMode: (mode: 'month' | 'week') => void;
}

const ExpandableCalendarGrid = ({
  viewMode,
  currentMonth,
  selectedDate,
  onSelectDate,
  onSwipeLeft,
  onSwipeRight,
  updateMode,
}: ExpandableCalendarGridProps) => {
  const { width: calendarWidth } = useWindowDimensions();
  const monthCalendarRef = useRef<FlatList>(null);
  const weekCalendarRef = useRef<FlatList>(null);
  const isWeekMode = viewMode === 'week';

  // 월 달력 데이터
  const monthsData = useCalendarMonthsData({
    currentMonth,
    selectedDate,
  });

  // 주 달력 데이터
  const weeksData = useCalendarWeeksData({
    currentMonth,
    selectedDate,
  });

  console.log('weeksData', weeksData);

  const calendarHeight = useCalendarHeight({
    datesCount: monthsData[1]?.dates.length ?? 0,
    containerWidth: calendarWidth,
  });

  const animatedHeight = useAnimatedHeightTransition({
    height: calendarHeight,
    duration: 250,
  });

  const panGesture = useVerticalSwipeGesture({
    onSwipeUp: () => updateMode('week'),
    onSwipeDown: () => updateMode('month'),
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

  const {
    handleMomentumScrollEnd: handleMomentumScrollEndMonth,
    handleGetItemLayout: handleGetItemLayoutMonth,
  } = useInfiniteHorizontalScroll({
    itemWidth: calendarWidth,
    scrollableRef: monthCalendarRef,
    onScrollToPrev: onSwipeLeft,
    onScrollToNext: onSwipeRight,
  });

  const renderWeeksInMonth = useMemo(
    () =>
      (
        monthKey: string,
        monthDates: CalendarDate[],
        weekIndex: number,
        onSelectDate: (date: Date) => void
      ) => {
        const weekdays = monthDates.slice(weekIndex * 7, (weekIndex + 1) * 7);
        const weekKey = `${monthKey}-${weekIndex}`;

        return (
          <View key={weekKey} style={styles.weekContainer}>
            {weekdays.map((calendarDate, dayIndex) => {
              const dateIndex = weekIndex * 7 + dayIndex;
              const dayKey = `${weekKey}-${dateIndex}`;

              return (
                <Day
                  key={dayKey}
                  calendarDate={calendarDate}
                  onPress={onSelectDate}
                />
              );
            })}
          </View>
        );
      },
    []
  );

  const renderMonthCalendarItem = useMemo(
    () =>
      ({ item }: { item: CalendarData }) => {
        const { key: monthKey, dates: monthDates, weeksCount } = item;

        return (
          <View
            style={[styles.monthCalendarContainer, { width: calendarWidth }]}
          >
            {Array.from({ length: weeksCount }).map((_, weekIndex) =>
              renderWeeksInMonth(monthKey, monthDates, weekIndex, onSelectDate)
            )}
          </View>
        );
      },
    [calendarWidth, onSelectDate, renderWeeksInMonth]
  );

  const renderWeekCalendarItem = useMemo(
    () =>
      ({ item }: { item: CalendarData }) => {
        const { key: weekKey, dates: weekDates } = item;
        console.log(
          'grid:weekKey',
          weekDates.map((date) => date.date.toDateString())
        );

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
    [calendarWidth, onSelectDate, renderWeeksInMonth]
  );

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
          {isWeekMode ? (
            <FlatList<(typeof monthsData)[0]>
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
          ) : (
            <FlatList
              ref={monthCalendarRef}
              data={monthsData}
              renderItem={renderMonthCalendarItem}
              keyExtractor={(item) => item.key}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={handleMomentumScrollEndMonth}
              getItemLayout={handleGetItemLayoutMonth}
              initialScrollIndex={1}
              decelerationRate={'fast'}
              bounces={false}
              removeClippedSubviews={false}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
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

export default ExpandableCalendarGrid;
