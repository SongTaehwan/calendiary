import { Gesture } from 'react-native-gesture-handler';

interface UseVerticalSwipeGestureProps {
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  threshold?: number;
}

/**
 * 수직 스와이프 제스처 감지 훅
 */
export function useVerticalSwipeGesture({
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
}: UseVerticalSwipeGestureProps) {
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetY([-20, 20])
    .onEnd((event) => {
      const { translationY, translationX } = event;

      const isVerticalGesture = Math.abs(translationY) > Math.abs(translationX);

      if (isVerticalGesture && Math.abs(translationY) > threshold) {
        if (translationY < 0) {
          onSwipeUp();
        } else {
          onSwipeDown();
        }
      }
    });

  return panGesture;
}

export default useVerticalSwipeGesture;
