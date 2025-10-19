import { useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, useWindowDimensions } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

// domain hooks
import { type CalendarData } from '../hooks/domains/types';
import useCalendarMonthsData from '../hooks/domains/useCalendarMonthsData';
import useCalendarHeight from '../hooks/domains/useCalendarHeight';

// utility hooks
import useAnimatedHeightTransition from '../hooks/utils/useAnimatedHeightTransition';
import useInfiniteHorizontalScroll from '../hooks/utils/useInfiniteHorizontalScroll';
import useVerticalSwipeGesture from '../hooks/utils/useVerticalSwipeGesture';

// components
import { getWeekIndexInMonth } from '../utils/calendar';
import WeekCalendar from './WeekCalendar';
import AnimatedWeek from './AnimatedWeek';

interface ExpandableCalendarGridProps {
  viewMode: 'month' | 'week';
  currentMonth: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

/**
 * 월-주간 전환 애니메이션 달력 컴포넌트
 */
const ExpandableCalendarGrid = ({
  viewMode,
  currentMonth,
  selectedDate,
  onSelectDate,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
}: ExpandableCalendarGridProps) => {
  const ANIMATION_DURATION = 300;
  const { width: calendarWidth } = useWindowDimensions();
  const monthCalendarRef = useRef<FlatList>(null);

  const isWeekMode = viewMode === 'week';
  const isInitialMount = useRef(true);

  // 조건부 렌더링 제어
  const [shouldRenderMonthList, setShouldRenderMonthList] = useState(true);
  const [shouldRenderWeekList, setShouldRenderWeekList] = useState(false);

  // 역방향 전환 시 초기 상태 제어 (주 모드의 최종 상태로 시작)
  const [shouldStartFromWeekState, setShouldStartFromWeekState] =
    useState(false);

  // 현재 활성 주의 인덱스
  const activeWeekIndex = getWeekIndexInMonth(selectedDate);

  // 월간 달력 데이터
  const monthsData = useCalendarMonthsData({
    currentMonth,
    selectedDate,
  });

  // 주간 행의 높이
  const weekHeight = calendarWidth / 7;

  // 달력 컨테이너 높이
  const calendarHeight = useCalendarHeight({
    datesCount: monthsData[1]?.dates.length ?? 0,
    containerWidth: calendarWidth,
  });

  const animatedHeight = useAnimatedHeightTransition({
    height: isWeekMode ? weekHeight : calendarHeight,
    duration: ANIMATION_DURATION + 50,
  });

  const panGesture = useVerticalSwipeGesture({
    onSwipeUp,
    onSwipeDown,
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

  // 모드 전환 시 렌더링 제어
  useEffect(() => {
    // 초기 마운트 시에는 실행하지 않음
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isWeekMode) {
      // 월 → 주 전환
      // AnimatedWeek 컴포넌트에서 애니메이션 시작
      // onCompleteCollapseAnimation 콜백 호출
      if (setShouldStartFromWeekState) {
        setShouldStartFromWeekState(false);
      }

      return () => {};
    } else {
      // 주 → 월 전환
      // 1. 월 달력을 즉시 렌더링 (entering 애니메이션 시작)
      // 2. 주 모드 최종 상태로 시작
      setShouldStartFromWeekState(true);
      setShouldRenderMonthList(true); // 월 달력 렌더링 시작
      setShouldRenderWeekList(false);

      // 3. 애니메이션 완료 후 주 달력 언마운트 및 플래그 리셋
      const timer = setTimeout(() => {
        setShouldStartFromWeekState(false);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isWeekMode]);

  const renderMonthCalendarItem = useMemo(
    () =>
      ({ item }: { item: CalendarData }) => {
        const { key: monthKey, dates: monthDates, weeksCount } = item;

        return (
          <View
            style={[styles.monthCalendarContainer, { width: calendarWidth }]}
          >
            {Array.from({ length: weeksCount }).map((_, weekIndex) => {
              const weekIndexStart = weekIndex * 7;
              const weekIndexEnd = (weekIndex + 1) * 7;
              const daysInWeek = monthDates.slice(weekIndexStart, weekIndexEnd);
              const weekKey = `${monthKey}-${weekIndex}`;

              return (
                <AnimatedWeek
                  key={weekKey}
                  days={daysInWeek}
                  isSelectedWeek={weekIndex === activeWeekIndex}
                  activeWeekIndex={activeWeekIndex}
                  isWeekMode={isWeekMode}
                  weekHeight={weekHeight}
                  shouldStartFromWeek={shouldStartFromWeekState}
                  onSelectDate={onSelectDate}
                  onCompleteCollapseAnimation={() => {
                    setShouldRenderWeekList(true);
                    setShouldRenderMonthList(false);
                  }}
                />
              );
            })}
          </View>
        );
      },
    [calendarWidth, onSelectDate, shouldStartFromWeekState]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, { height: animatedHeight }]}>
          {/* 주간 달력 */}
          {shouldRenderWeekList && (
            <Animated.View
              key="week-calendar"
              entering={FadeIn.duration(ANIMATION_DURATION)}
              style={StyleSheet.absoluteFill}
            >
              <WeekCalendar
                currentMonth={currentMonth}
                selectedDate={selectedDate}
                onSwipeLeft={onSwipeLeft}
                onSwipeRight={onSwipeRight}
                onSelectDate={onSelectDate}
              />
            </Animated.View>
          )}
          {/* 월간 달력 */}
          {shouldRenderMonthList && (
            <Animated.View
              key="month-calendar"
              exiting={FadeOut.duration(ANIMATION_DURATION + 200)}
              style={StyleSheet.absoluteFill}
            >
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
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  monthCalendarContainer: {},
});

export default ExpandableCalendarGrid;
