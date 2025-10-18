import { useCallback, type RefObject } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

interface ScrollableRef {
  scrollToIndex: (params: { index: number; animated: boolean }) => void;
}

interface UseInfiniteHorizontalScrollProps {
  itemWidth: number;
  scrollableRef: RefObject<ScrollableRef | null | undefined>;
  onScrollToPrev: () => void;
  onScrollToNext: () => void;
}

/**
 * 무한 스크롤 패턴 (이전-현재-다음)
 * - 양 끝으로 스크롤 시 콜백 실행 후 중앙으로 리셋
 */
export function useInfiniteHorizontalScroll({
  itemWidth,
  scrollableRef,
  onScrollToPrev,
  onScrollToNext,
}: UseInfiniteHorizontalScrollProps) {
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!scrollableRef.current) {
        console.warn('FlatList ref is not found');
        return;
      }

      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / itemWidth);
      const PREV_INDEX = 0;
      const CENTER_INDEX = 1;
      const NEXT_INDEX = 2;

      if (index === PREV_INDEX) {
        onScrollToPrev();
        scrollableRef.current.scrollToIndex({
          index: CENTER_INDEX,
          animated: false,
        });
      } else if (index === NEXT_INDEX) {
        onScrollToNext();
        scrollableRef.current.scrollToIndex({
          index: CENTER_INDEX,
          animated: false,
        });
      }
    },
    [itemWidth, onScrollToPrev, onScrollToNext]
  );

  const handleGetItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth]
  );

  return {
    handleMomentumScrollEnd,
    handleGetItemLayout,
  };
}
