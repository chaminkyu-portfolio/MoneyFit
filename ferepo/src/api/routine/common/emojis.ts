import apiClient from '../../client';
import {
  ApiResponse,
  EmojiListResponse,
  EmojiListParams,
} from '../../../types/api';

// 이모지 전체 조회 API
export const getRoutineEmoji = async (
  params: EmojiListParams = {},
): Promise<ApiResponse<EmojiListResponse>> => {
  const { category, page = 0, size = 20 } = params;

  console.log('🔍 이모지 API 호출:', `/api/v1/routines/emoji?category=${category}`);

  const response = await apiClient.get<ApiResponse<EmojiListResponse>>(
    '/api/v1/routines/emoji',
    {
      params: {
        ...(category && { category }),
        page,
        size,
      },
    },
  );

  console.log('🔍 이모지 API 응답:', category, response.data);
  return response.data;
};
