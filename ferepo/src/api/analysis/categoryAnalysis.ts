import apiClient from '../client';
import { CategoryAnalysisResponse } from '../../types/api';

/**
 * 소비 패턴 분석 API
 * @returns Promise<CategoryAnalysisResponse>
 */
export const getCategoryAnalysis =
  async (): Promise<CategoryAnalysisResponse> => {
    const response = await apiClient.get<CategoryAnalysisResponse>(
      '/api/v1/analysis/category',
    );
    return response.data;
  };
