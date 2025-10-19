import { FlatList, useWindowDimensions } from 'react-native';
import { useMemo, useRef } from 'react';

// Utility hooks
import useInfiniteHorizontalScroll from '../hooks/utils/useInfiniteHorizontalScroll';

// Domain hooks
import useCalendarWeeksData from '../hooks/domains/useCalendarWeeksData';
import type { CalendarData } from '../hooks/domains/types';

// Components
import Week from './Week';

interface WeekCalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSelectDate: (date: Date) => void;
}

/**
 * 주간 달력 컴포넌트
 * - 주간 모드는 애니메이션 효과 없이 주간 데이터를 표시
 */
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
        const { dates: weekDates } = item;

        return (
          <Week
            style={{ width: calendarWidth }}
            days={weekDates}
            onSelectDate={onSelectDate}
          />
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

export default WeekCalendar;
