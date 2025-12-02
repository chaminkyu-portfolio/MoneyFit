import apiClient from '../client';
import { SurveyRequest, SurveyResponse, ApiResponse } from '../../types/api';

export const postSurvey = async (
  data: SurveyRequest,
): Promise<SurveyResponse> => {
  console.log('🔍 postSurvey API 호출:', {
    url: '/api/v1/user/survey',
    method: 'POST',
    data: data,
  });

  try {
    const response = await apiClient.post<SurveyResponse>(
      '/api/v1/user/survey',
      data,
    );
    console.log('🔍 postSurvey API 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🔍 postSurvey API 실패:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });
    throw error;
  }
};

export const getSurvey = async (): Promise<ApiResponse<any>> => {
  const response = await apiClient.get<ApiResponse<any>>('/api/v1/user/survey');
  return response.data;
};
