import { useQuery } from '@tanstack/react-query';
import { getRecommendDaily } from '../../api/analysis/recommendDaily';
import { RecommendDailyResponse } from '../../types/api';

/**
 * 추천 루틴 훅
 * @returns useQuery 결과
 */
export const useRecommendDaily = () => {
  return useQuery<RecommendDailyResponse>({
    queryKey: ['recommendDaily'],
    queryFn: getRecommendDaily,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
