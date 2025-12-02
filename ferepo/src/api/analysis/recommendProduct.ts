import apiClient from '../client';
import { RecommendProductResponse } from '../../types/api';

/**
 * 맞춤 금융 상품 추천 API
 * @returns Promise<RecommendProductResponse>
 */
export const getRecommendProduct =
  async (): Promise<RecommendProductResponse> => {
    const response = await apiClient.get<RecommendProductResponse>(
      '/api/v1/analysis/recommend-product',
    );
    return response.data;
  };
