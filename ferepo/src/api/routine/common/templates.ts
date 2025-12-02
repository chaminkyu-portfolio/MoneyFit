import apiClient from '../../client';
import {
  ApiResponse,
  RoutineTemplateListResponse,
  RoutineTemplateListParams,
} from '../../../types/api';

// 루틴 템플릿 조회 API
export const getRoutineTemplate = async (
  params: RoutineTemplateListParams = {},
): Promise<ApiResponse<RoutineTemplateListResponse>> => {
  const { category, page = 0, size = 10 } = params;

  console.log('🔍 템플릿 API 호출:', `/api/v1/routines/templates?category=${category}`);

  const response = await apiClient.get<
    ApiResponse<RoutineTemplateListResponse>
  >('/api/v1/routines/templates', {
    params: {
      ...(category && { category }),
      page,
      size,
    },
  });

  console.log('🔍 템플릿 API 응답:', category, response.data);
  return response.data;
};

