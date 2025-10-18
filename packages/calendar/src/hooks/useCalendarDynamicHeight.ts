import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface UseCalendarDynamicHeightProps {
  weeksCount: number;
  weekHeight: number;
}

const useCalendarDynamicHeight = ({
  weeksCount,
  weekHeight,
}: UseCalendarDynamicHeightProps) => {
  const animatedHeight = useRef(
    new Animated.Value(weeksCount * weekHeight)
  ).current;

  useEffect(() => {
    const newHeight = weeksCount * weekHeight;

    Animated.timing(animatedHeight, {
      toValue: newHeight,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [weeksCount, weekHeight, animatedHeight]);

  return animatedHeight;
};

export default useCalendarDynamicHeight;
