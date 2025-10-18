import { useMemo } from 'react';

interface UseCalendarHeightParams {
  datesCount: number;
  containerWidth: number;
}

/**
 * 달력 그리드 높이 계산 훅
 * - 주 수와 셀 크기 기반 높이 계산
 * - 도메인 로직 캡슐화
 */
export function useCalendarHeight({
  datesCount,
  containerWidth,
}: UseCalendarHeightParams): number {
  return useMemo(() => {
    const DAYS_IN_WEEK = 7;
    const weeksCount = datesCount / DAYS_IN_WEEK;
    const dayWidth = containerWidth / DAYS_IN_WEEK;
    const dayHeight = dayWidth;

    return weeksCount * dayHeight;
  }, [datesCount, containerWidth]);
}
