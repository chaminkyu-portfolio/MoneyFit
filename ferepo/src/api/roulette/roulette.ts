import apiClient from '../client';
import { useAuthStore } from '../../store/authStore';
import { ApiResponse } from '../../types/api';

// 룰렛 결과 응답 타입
export interface RouletteResultResponse {
  points: number;
  ticketsUsed: number;
  remainingTickets: number;
  message: string;
}

// 룰렛 스핀 요청 타입
export interface RouletteSpinRequest {
  ticketCost?: number; // 기본값 1
}

// 룰렛 스핀 API
export const spinRoulette = async (
  request: RouletteSpinRequest = {}
): Promise<ApiResponse<RouletteResultResponse>> => {
  const { accessToken } = useAuthStore.getState();
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};
    
  const response = await apiClient.post<ApiResponse<RouletteResultResponse>>(
    '/api/v1/roulette/spin',
    { ticketCost: request.ticketCost || 1 },
    config
  );
  return response.data;
};

// 내 티켓 조회 API
export interface MyTicketsResponse {
  tickets: number;
}

export const getMyTickets = async (): Promise<ApiResponse<MyTicketsResponse>> => {
  const { accessToken } = useAuthStore.getState();
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};
    
  const response = await apiClient.get<ApiResponse<MyTicketsResponse>>(
    '/api/v1/roulette/my-tickets',
    config
  );
  return response.data;
};
