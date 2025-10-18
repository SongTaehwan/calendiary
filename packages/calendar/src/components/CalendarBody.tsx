import { useMemo, useRef } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import { type CalendarDate } from '../utils/calendar';
import Day from './Day';
import useAnimatedHeightTransition from '../hooks/utils/useAnimatedHeightTransition';
import useCalendarMonthsData from '../hooks/domains/useCalendarMonthsData';
import { useInfiniteHorizontalScroll } from '../hooks/utils/useInfiniteHorizontalScroll';
import Animated from 'react-native-reanimated';
import { useCalendarHeight } from '../hooks/domains/useCalendarHeight';

interface CalendarBodyProps {
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

/**
 * 월 달력 날짜 그리드 컴포넌트
 * - 4~6주 x 7일 형태로 날짜 표시 (동적)
 * - FlatList 페이징으로 월 이동 (네이티브 성능)
 */
const CalendarBody: React.FC<CalendarBodyProps> = ({
  currentMonth,
  selectedDate,
  onSelectDate,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { width: calendarWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const monthsData = useCalendarMonthsData({
    currentMonth,
    selectedDate,
  });

  const calendarHeight = useCalendarHeight({
    datesCount: monthsData[1]?.dates.length ?? 0,
    containerWidth: calendarWidth,
  });

  const animatedHeight = useAnimatedHeightTransition({
    height: calendarHeight,
    duration: 250,
  });

  const { handleMomentumScrollEnd, handleGetItemLayout } =
    useInfiniteHorizontalScroll({
      itemWidth: calendarWidth,
      scrollableRef: flatListRef,
      onScrollToPrev: onSwipeLeft,
      onScrollToNext: onSwipeRight,
    });

  const renderWeeks = useMemo(
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

  const renderMonths = useMemo(
    () =>
      ({ item }: { item: (typeof monthsData)[0] }) => {
        const { key: monthKey, dates: monthDates, weeksCount } = item;

        return (
          <View style={[styles.monthContainer, { width: calendarWidth }]}>
            {Array.from({ length: weeksCount }).map((_, weekIndex) =>
              renderWeeks(monthKey, monthDates, weekIndex, onSelectDate)
            )}
          </View>
        );
      },
    [calendarWidth, onSelectDate, renderWeeks]
  );

  return (
    <Animated.View style={[styles.container, { height: animatedHeight }]}>
      <FlatList<(typeof monthsData)[0]>
        ref={flatListRef}
        data={monthsData}
        renderItem={renderMonths}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={handleGetItemLayout}
        initialScrollIndex={1}
        decelerationRate={'fast'}
        bounces={false}
        removeClippedSubviews={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'green',
  },
  monthContainer: {},
  weekContainer: {
    flexDirection: 'row',
  },
});

export default CalendarBody;
