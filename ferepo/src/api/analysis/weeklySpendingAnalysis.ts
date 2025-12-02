import apiClient from '../client';
import { WeeklySpendingAnalysisResponse } from '../../types/api';

/**
 * 이번 주 소비패턴 분석 API
 * @returns Promise<WeeklySpendingAnalysisResponse>
 */
export const getWeeklySpendingAnalysis =
  async (): Promise<WeeklySpendingAnalysisResponse> => {
    const response = await apiClient.get<WeeklySpendingAnalysisResponse>(
      '/api/v1/analysis/weekly',
    );
    return response.data;
  };
