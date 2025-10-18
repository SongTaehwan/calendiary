import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { generateCalendarDates, type CalendarDate } from '../utils/calendar';
import { addMonths } from '../utils/date';
import Day from './Day';

interface CalendarBodyProps {
  dates: CalendarDate[];
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
  dates,
  currentMonth,
  selectedDate,
  onSelectDate,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const { width: calendarWidth } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  const SEVEN_DAYS = 7;
  // 주 셀 높이
  const WEEK_HEIGHT = calendarWidth / SEVEN_DAYS;

  // 현재 월의 주 수 계산
  const currentWeeksCount = dates.length / SEVEN_DAYS;

  // 달력 컨테이너 높이
  const animatedHeight = useRef(
    new Animated.Value(currentWeeksCount * WEEK_HEIGHT)
  ).current;

  useEffect(() => {
    const currentWeeksCount = dates.length / SEVEN_DAYS;
    const newHeight = currentWeeksCount * WEEK_HEIGHT;

    Animated.timing(animatedHeight, {
      toValue: newHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [dates.length, animatedHeight]);

  // 3개의 달력 데이터 (이전, 현재, 다음)
  const monthsData = useMemo(() => {
    const prevMonth = addMonths(currentMonth, -1);
    const nextMonth = addMonths(currentMonth, 1);

    const prevMonthDates = generateCalendarDates(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      selectedDate
    );

    const nextMonthDates = generateCalendarDates(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      selectedDate
    );

    return [
      {
        key: `${prevMonth.getFullYear()}-${prevMonth.getMonth()}`,
        dates: prevMonthDates,
        weeksCount: prevMonthDates.length / 7,
      },
      {
        key: `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`,
        dates,
        weeksCount: dates.length / 7,
      },
      {
        key: `${nextMonth.getFullYear()}-${nextMonth.getMonth()}`,
        dates: nextMonthDates,
        weeksCount: nextMonthDates.length / 7,
      },
    ];
  }, [currentMonth, dates, selectedDate]);

  // 스크롤 이벤트 처리 (무한 스크롤 패턴)
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / calendarWidth);

      if (index === 0) {
        onSwipeLeft();
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
      } else if (index === 2) {
        onSwipeRight();
        flatListRef.current?.scrollToIndex({ index: 1, animated: false });
      }
    },
    [calendarWidth, onSwipeLeft, onSwipeRight]
  );

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

  const handleGetItemLayout = useCallback(
    (
      _: Readonly<ArrayLike<(typeof monthsData)[0]>> | undefined,
      index: number
    ) => ({
      length: calendarWidth,
      offset: calendarWidth * index,
      index,
    }),
    [calendarWidth]
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
