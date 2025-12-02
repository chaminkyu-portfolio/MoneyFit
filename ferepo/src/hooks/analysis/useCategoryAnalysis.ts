import { useQuery } from '@tanstack/react-query';
import { getCategoryAnalysis } from '../../api/analysis/categoryAnalysis';
import { CategoryAnalysisResponse } from '../../types/api';

/**
 * 소비 패턴 분석 훅
 * @returns useQuery 결과
 */
export const useCategoryAnalysis = () => {
  return useQuery<CategoryAnalysisResponse>({
    queryKey: ['categoryAnalysis'],
    queryFn: getCategoryAnalysis,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
