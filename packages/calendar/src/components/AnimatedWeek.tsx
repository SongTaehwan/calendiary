import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect, useLayoutEffect, useRef } from 'react';

// Domain types
import type { CalendarDate } from '../hooks/domains/types';

// Components
import Week from './Week';
import { scheduleOnRN } from 'react-native-worklets';

interface AnimatedWeekProps {
  days: CalendarDate[];
  isSelectedWeek: boolean;
  activeWeekIndex: number;
  isWeekMode: boolean;
  weekHeight: number;
  shouldStartFromWeek: boolean; // 역방향 전환 시 주 모드 상태로 시작
  onSelectDate: (date: Date) => void;
  onCompleteCollapseAnimation?: () => void;
}

/**
 * 월-주간 전환 애니메이션 컴포넌트
 * 1. 초기 상태 - visible
 * 2. 월 -> 주 - invisible
 * 3. 주 -> 월 -> visible
 */
const AnimatedWeek: React.FC<AnimatedWeekProps> = ({
  days,
  isSelectedWeek,
  activeWeekIndex,
  isWeekMode,
  weekHeight,
  shouldStartFromWeek,
  onSelectDate,
  onCompleteCollapseAnimation,
}) => {
  const ANIMATION_DURATION = 300;

  // 초기 상태 - visible
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);

  // ✅ 초기 상태를 useLayoutEffect에서 동기적으로 설정
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    if (isInitialMount.current && shouldStartFromWeek) {
      // 첫 렌더링이고 역방향 전환인 경우 즉시 설정
      opacity.value = isSelectedWeek ? 1 : 0;
      translateY.value = -activeWeekIndex * weekHeight;
      isInitialMount.current = false;
    }
  }, []);

  // 이전 상태 추적하여 불필요한 재실행 방지
  const prevStateRef = useRef({
    isWeekMode,
    activeWeekIndex,
    isSelectedWeek,
    shouldStartFromWeek,
  });

  useEffect(() => {
    const prevState = prevStateRef.current;

    const hasStateChanged =
      prevState.isWeekMode !== isWeekMode ||
      prevState.activeWeekIndex !== activeWeekIndex ||
      prevState.isSelectedWeek !== isSelectedWeek ||
      prevState.shouldStartFromWeek !== shouldStartFromWeek;

    if (!hasStateChanged) {
      return; // 조기 반환으로 불필요한 실행 방지
    }

    if (!shouldStartFromWeek) {
      const targetOpacity = isWeekMode && !isSelectedWeek ? 0 : 1;
      const targetTranslateY = isWeekMode ? -activeWeekIndex * weekHeight : 0;

      opacity.value = withTiming(targetOpacity, {
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      });
      translateY.value = withTiming(
        targetTranslateY,
        {
          duration: ANIMATION_DURATION,
          easing: Easing.linear,
        },
        (finished) => {
          //  월 -> 주 전환 완료
          if (isWeekMode && finished && onCompleteCollapseAnimation) {
            scheduleOnRN(onCompleteCollapseAnimation);
          }
        }
      );
    }

    // 이전 상태 업데이트
    prevStateRef.current = {
      isWeekMode,
      activeWeekIndex,
      isSelectedWeek,
      shouldStartFromWeek,
    };
  }, [
    isWeekMode,
    activeWeekIndex,
    isSelectedWeek,
    weekHeight,
    shouldStartFromWeek,
  ]);

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      <Week days={days} onSelectDate={onSelectDate} />
    </Animated.View>
  );
};

export default AnimatedWeek;
