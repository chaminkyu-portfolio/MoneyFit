import apiClient from '../client';
import { 
  ApiResponse, 
  RankingResponse
} from '../../types/api';

// 랭킹 조회 함수 (나이 랭킹)
export const getRanking = async (): Promise<ApiResponse<RankingResponse>> => {
  const response = await apiClient.get<ApiResponse<RankingResponse>>(
    `/api/v1/home/rank`,
  );
  return response.data;
};
