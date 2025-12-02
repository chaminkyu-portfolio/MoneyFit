import { useQuery } from '@tanstack/react-query';
import { getWeeklySpendingAnalysis } from '../../api/analysis/weeklySpendingAnalysis';
import { WeeklySpendingAnalysisResponse } from '../../types/api';

/**
 * 이번 주 소비패턴 분석 훅
 * @returns useQuery 결과
 */
export const useWeeklySpendingAnalysis = () => {
  return useQuery<WeeklySpendingAnalysisResponse>({
    queryKey: ['weeklySpendingAnalysis'],
    queryFn: getWeeklySpendingAnalysis,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
