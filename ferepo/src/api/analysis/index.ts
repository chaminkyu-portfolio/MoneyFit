// 분석 관련 API

// export * from './consumption';
// export * from './achievement';
// export * from './streak';
// export * from './summary';

import apiClient from '../client';
import {
  ApiResponse,
  GetWeeklySummaryParams,
  GetWeeklySummaryResponse,
  GetMaxStreakResponse,
  GivePointResponse,
  RcmdConsumptionRoutineParams,
  RcmdConsumptionRoutineResponse,
} from '../../types/api';

/**
 * 주간 요약 조회
 * GET /api/v1/analysis/weekly-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&routineType=DAILY|FINANCE
 */
export const getWeeklySummary = async (
  params: GetWeeklySummaryParams,
): Promise<ApiResponse<GetWeeklySummaryResponse>> => {
  const { startDate, endDate, routineType } = params;
  const response = await apiClient.get<ApiResponse<GetWeeklySummaryResponse>>(
    '/api/v1/analysis/weekly-summary',
    {
      params: { startDate, endDate, routineType },
    },
  );
  return response.data;
};

/**
 * 최대 연속 일수 조회
 * GET /api/v1/analysis/max-streak
 */
export const getMaxStreak = async (): Promise<
  ApiResponse<GetMaxStreakResponse>
> => {
  const response = await apiClient.get<ApiResponse<GetMaxStreakResponse>>(
    '/api/v1/analysis/max-streak',
  );
  return response.data;
};

/**
 * 일일 분석 조회
 * GET /api/v1/analysis/daily
 */
export const getDailyAnalysis = async (): Promise<ApiResponse<any>> => {
  console.log('🔍 getDailyAnalysis API 호출 시작');

  try {
    const response = await apiClient.get<ApiResponse<any>>(
      '/api/v1/analysis/daily',
    );

    console.log('🔍 getDailyAnalysis API 응답 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error('🔍 getDailyAnalysis API 호출 실패:', error);
    throw error;
  }
};

/**
 * 연속 1주일 달성 포인트 지급
 * POST /api/v1/analysis/weekly-point
 */
export const givePoint = async (): Promise<ApiResponse<GivePointResponse>> => {
  console.log('🔍 givePoint API 호출 시작');

  try {
    const response = await apiClient.post<ApiResponse<GivePointResponse>>(
      '/api/v1/analysis/weekly-point',
    );

    console.log('🔍 givePoint API 응답 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error('🔍 givePoint API 호출 실패:', error);
    throw error;
  }
};

/**
 * 소비 루틴 맞춤 추천
 * GET /api/v1/analysis/rcmd-cosumRoutine
 */
export const rcmdConsumptionRoutine = async (
  params: RcmdConsumptionRoutineParams,
): Promise<RcmdConsumptionRoutineResponse> => {
  console.log('🔍 rcmdConsumptionRoutine API 호출 시작');

  try {
    const response = await apiClient.get<RcmdConsumptionRoutineResponse>(
      '/api/v1/analysis/rcmd-cosumRoutine',
      {
        params,
      },
    );

    console.log('🔍 rcmdConsumptionRoutine API 응답 성공:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    return response.data;
  } catch (error) {
    console.error('🔍 rcmdConsumptionRoutine API 호출 실패:', error);
    throw error;
  }
};
