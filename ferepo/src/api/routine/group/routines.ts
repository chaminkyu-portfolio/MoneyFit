import apiClient from '../../client';
import errorHandler from '../../../utils/errorHandler';
import { Alert } from 'react-native';
import {
  ApiResponse,
  GroupRoutineListResponse,
  GroupRoutineListParams,
  GroupRoutineSearchParams,
  CreateGroupRoutineRequest,
  CreateGroupRoutineResponse,
  UpdateGroupRoutineRequest,
  UpdateGroupRoutineResponse,
  DeleteGroupRoutineResponse,
  JoinGroupRoutineResponse,
  LeaveGroupRoutineResponse,
  AwardPointForGroupRoutineRequest,
  AwardPointForGroupRoutineResponse,
} from '../../../types/api';

// 단체루틴 생성 API
export const createGroupRoutine = async (
  data: CreateGroupRoutineRequest,
): Promise<ApiResponse<CreateGroupRoutineResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreateGroupRoutineResponse>
  >('/api/v1/routines/groups', data);

  return response.data;
};

// 단체루틴 수정 API
export const updateGroupRoutine = async (
  groupRoutineListId: string,
  data: UpdateGroupRoutineRequest,
): Promise<ApiResponse<UpdateGroupRoutineResponse>> => {
  const response = await apiClient.put<ApiResponse<UpdateGroupRoutineResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}`,
    data,
  );

  return response.data;
};

// 단체루틴 삭제 API
export const deleteGroupRoutine = async (
  groupRoutineListId: string,
): Promise<ApiResponse<DeleteGroupRoutineResponse>> => {
  const response = await apiClient.delete<
    ApiResponse<DeleteGroupRoutineResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}`);

  return response.data;
};

// 단체루틴 리스트 조회 API
export const getGroupRoutines = async (
  params: GroupRoutineListParams = {},
): Promise<ApiResponse<GroupRoutineListResponse>> => {
  const { page = 0, size = 10, joined } = params;

  const requestParams: any = {
    page: page.toString(),
    size: size.toString(),
  };

  // joined 파라미터가 있으면 추가
  if (joined !== undefined) {
    requestParams.joined = joined.toString();
  }

  const queryString = new URLSearchParams(requestParams).toString();

  const response = await apiClient.get<ApiResponse<GroupRoutineListResponse>>(
    '/api/v1/routines/groups',
    {
      params: requestParams,
    },
  );

  console.log('🔍 getGroupRoutines 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    items: response.data?.result?.items,
    itemsCount: response.data?.result?.items?.length || 0,
  });

  return response.data;
};

// 내 단체루틴 조회[홈] API
export const getMyGroupRoutines = async (
  params: GroupRoutineListParams = {},
): Promise<ApiResponse<GroupRoutineListResponse>> => {
  const { page = 0, size = 10 } = params;

  const requestParams: any = {
    page: page.toString(),
    pageSize: size.toString(),
  };

  const response = await apiClient.get<ApiResponse<GroupRoutineListResponse>>(
    '/api/v1/home/groups',
    {
      params: requestParams,
    },
  );

  console.log('🔍 getMyGroupRoutines 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    result: response.data?.result,
    items: response.data?.result?.items,
    itemsCount: response.data?.result?.items?.length || 0,
  });

  return response.data;
};

// 단체루틴 가입 API
export const joinGroupRoutine = async (
  groupRoutineListId: string,
): Promise<ApiResponse<JoinGroupRoutineResponse>> => {
  const response = await apiClient.post<ApiResponse<JoinGroupRoutineResponse>>(
    `/api/v1/routines/groups/${groupRoutineListId}/join`,
  );
  return response.data;
};

// 단체루틴 나가기 API
export const leaveGroupRoutine = async (
  groupRoutineListId: string,
): Promise<ApiResponse<LeaveGroupRoutineResponse>> => {
  console.log('🔍 leaveGroupRoutine API 호출:', {
    groupRoutineListId,
    url: `/api/v1/routines/groups/${groupRoutineListId}/leave`,
  });

  const response = await apiClient.delete<
    ApiResponse<LeaveGroupRoutineResponse>
  >(`/api/v1/routines/groups/${groupRoutineListId}/leave`);

  console.log('🔍 leaveGroupRoutine API 응답:', {
    status: response.status,
    data: response.data,
  });

  return response.data;
};

// 단체루틴 검색 API
export const searchGroupRoutines = async (
  params: GroupRoutineSearchParams,
): Promise<ApiResponse<GroupRoutineListResponse>> => {
  try {
    const { keyword } = params;

    const requestParams: any = {
      keyword,
    };

    const response = await apiClient.get<ApiResponse<GroupRoutineListResponse>>(
      '/api/v1/routines/groups/search',
      {
        params: requestParams,
      },
    );

    console.log('🔍 searchGroupRoutines 응답:', {
      status: response.status,
      data: response.data,
      isSuccess: response.data?.isSuccess,
      result: response.data?.result,
      items: response.data?.result?.items,
      itemsCount: response.data?.result?.items?.length || 0,
      keyword,
    });

    return response.data;
  } catch (error) {
    // 에러 처리
    const errorMessage = errorHandler.handleApiError(error);
    console.error('🔍 searchGroupRoutines 에러:', {
      error,
      errorMessage,
      keyword: params.keyword,
    });
    throw error; // 에러를 다시 던져서 React Query에서 처리할 수 있도록
  }
};

export const awardPointForGroupRoutine = async (
  groupRoutineListId: string,
  point: number,
): Promise<ApiResponse<string>> => {
  try {
  const url = `/api/v1/routines/groups/${groupRoutineListId}/points?point=${point}`;
  console.log(url);
  const response = await apiClient.post<ApiResponse<string>>(
    `/api/v1/routines/groups/${groupRoutineListId}/points?point=${point}`,
  );
  return response.data;
  } catch (error) {
    // 에러 처리
    const errorMessage = errorHandler.handleApiError(error);
    Alert.alert('', `${errorMessage}`, [
      { text: '확인' },
    ]);
    throw error; // 에러를 다시 던져서 React Query에서 처리할 수 있도록
  }
};