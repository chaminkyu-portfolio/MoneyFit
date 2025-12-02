import { useQuery } from '@tanstack/react-query';
import { getRecommendProduct } from '../../api/analysis/recommendProduct';
import { RecommendProductResponse } from '../../types/api';

/**
 * 맞춤 금융 상품 추천 훅
 * @returns useQuery 결과
 */
export const useRecommendProduct = () => {
  return useQuery<RecommendProductResponse>({
    queryKey: ['recommendProduct'],
    queryFn: getRecommendProduct,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
};
