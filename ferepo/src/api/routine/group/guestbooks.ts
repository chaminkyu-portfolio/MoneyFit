import apiClient from '../../client';
import {
  ApiResponse,
  GroupGuestbookListResponse,
  GroupGuestbookListParams,
  CreateGroupGuestbookRequest,
  CreateGroupGuestbookResponse,
  DeleteGroupGuestbookResponse,
} from '../../../types/api';

// 방명록 조회 API
export const getGroupGuestbooks = async (
  groupRoutineListId: string,
  params: GroupGuestbookListParams = {},
): Promise<ApiResponse<GroupGuestbookListResponse>> => {
  const { page = 0, size = 20 } = params;

  const response = await apiClient.get<ApiResponse<GroupGuestbookListResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}/guestbooks`,
    {
      params: {
        page,
        size,
      },
    },
  );

  return response.data;
};

// 방명록 작성 API
export const createGroupGuestbook = async (
  groupRoutineListId: string,
  data: CreateGroupGuestbookRequest,
): Promise<ApiResponse<CreateGroupGuestbookResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreateGroupGuestbookResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/guestbooks`, data);
  return response.data;
};

// 방명록 삭제 API
export const deleteGroupGuestbook = async (
  groupRoutineListId: string,
  guestbookId: string,
): Promise<ApiResponse<DeleteGroupGuestbookResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeleteGroupGuestbookResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/guestbooks/${guestbookId}`);
  return response.data;
};
