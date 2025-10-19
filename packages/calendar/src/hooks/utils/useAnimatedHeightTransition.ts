import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';

interface UseAnimatedHeightTransitionProps {
  height: number;
  duration: number;
}

const useAnimatedHeightTransition = ({
  height,
  duration,
}: UseAnimatedHeightTransitionProps) => {
  const animatedHeight = useSharedValue(height);

  useEffect(() => {
    animatedHeight.value = withTiming(height, {
      duration,
    });
  }, [height, duration]);

  return animatedHeight;
};

export default useAnimatedHeightTransition;
