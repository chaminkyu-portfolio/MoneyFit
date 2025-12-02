import apiClient from '../../client';
import {
  ApiResponse,
  CreatePersonalRoutineListRequest,
  CreatePersonalRoutineListResponse,
  UpdatePersonalRoutineListRequest,
  UpdatePersonalRoutineListResponse,
  DeletePersonalRoutineListResponse,
  PersonalRoutineListResponse,
  PersonalRoutineListParams,
  DonePersonalRoutineResponse,
  DonePersonalRoutineParams,
  DoneMyRoutineListResponse,
  CreatePersonalRoutineDetailRequest,
  CreatePersonalRoutineDetailResponse,
} from '../../../types/api';

// 개인루틴 리스트 생성 API
export const makeMyRoutineList = async (
  data: CreatePersonalRoutineListRequest,
): Promise<ApiResponse<CreatePersonalRoutineListResponse>> => {
  try {
    const response = await apiClient.post<
      ApiResponse<CreatePersonalRoutineListResponse>
    >('/api/v1/my-routine/list', data);

    return response.data;
  } catch (error: any) {
    console.error('개인루틴 생성 API 에러:', error.message);
    throw error;
  }
};

// 개인루틴 리스트 수정 API
export const updateRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: UpdatePersonalRoutineListRequest,
): Promise<ApiResponse<UpdatePersonalRoutineListResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<UpdatePersonalRoutineListResponse>
  >(`/api/v1/my-routine/list/${myRoutineListId}`, data);

  return response.data;
};

// 개인루틴 리스트 삭제 API
export const deleteRoutineToMyRoutineList = async (
  myRoutineListId: string,
): Promise<ApiResponse<DeletePersonalRoutineListResponse>> => {
  console.log('🔍 deleteRoutineToMyRoutineList API 호출:', {
    myRoutineListId,
    url: `/api/v1/my-routine/list/${myRoutineListId}`,
  });

  try {
    const response = await apiClient.delete<
      ApiResponse<DeletePersonalRoutineListResponse>
    >(`/api/v1/my-routine/list/${myRoutineListId}`);

    console.log('🔍 deleteRoutineToMyRoutineList API 성공:', {
      status: response.status,
      data: response.data,
    });

    return response.data;
  } catch (error: any) {
    console.error('🔍 deleteRoutineToMyRoutineList API 에러:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// 개인루틴 리스트 전체조회 API
export const showMyRoutineList = async (
  params: PersonalRoutineListParams = {},
): Promise<ApiResponse<PersonalRoutineListResponse>> => {
  const { day, date, page = 0, size = 10 } = params;

  console.log('🔍 showMyRoutineList API 호출 파라미터:', params);

  const requestParams = {
    ...(day && { day }),
    ...(date && { date }), // date를 yyyy-mm-dd 형식 그대로 사용
    page: page.toString(),
    size: size.toString(),
  };

  const queryString = new URLSearchParams(requestParams).toString();
  console.log('🔍 showMyRoutineList 요청 URL:', '/api/v1/my-routine/list');
  console.log('🔍 showMyRoutineList 요청 파라미터:', requestParams);

  try {
    const response = await apiClient.get<
      ApiResponse<PersonalRoutineListResponse>
    >('/api/v1/my-routine/list', {
      params: {
        ...(day && { day }),
        ...(date && { date }), // date를 yyyy-mm-dd 형식 그대로 사용
        page,
        size,
      },
    });

    console.log('🔍 showMyRoutineList 응답:', {
      status: response.status,
      data: response.data,
      isSuccess: response.data?.isSuccess,
      result: response.data?.result,
      items: response.data?.result?.items,
      itemsCount: response.data?.result?.items?.length || 0,
      totalItems: response.data?.result?.totalItems,
      totalPages: response.data?.result?.totalPages,
      page: response.data?.result?.page,
      pageSize: response.data?.result?.pageSize,
    });

    // 각 루틴의 상세 정보 로깅
    if (response.data?.result?.items) {
      console.log(
        '🔍 개인루틴 상세 정보:',
        response.data.result.items.map((item: any) => ({
          id: item.id,
          title: item.title,
          routineType: item.routineType,
          dayTypes: item.dayTypes,
          startTime: item.startTime,
          endTime: item.endTime,
          percent: item.percent,
        })),
      );
    }
    return response.data;
  } catch (error: any) {
    console.error('🔍 showMyRoutineList API 에러:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// 개인루틴 리스트 수행 API
export const doneRoutineToMyRoutineList = async (
  routineId: string,
  params: DonePersonalRoutineParams,
): Promise<ApiResponse<DonePersonalRoutineResponse>> => {
  const { date } = params;

  const response = await apiClient.post<
    ApiResponse<DonePersonalRoutineResponse>
  >(
    `/api/v1/my-routine/list/routine/complete/${routineId}`,
    {},
    {
      params: { date },
    },
  );

  return response.data;
};

// 루틴리스트 기록하기 API
export const doneMyRoutineList = async (
  myRoutineListId: string,
  params: DonePersonalRoutineParams,
): Promise<ApiResponse<DoneMyRoutineListResponse>> => {
  const { date } = params;

  const response = await apiClient.post<ApiResponse<DoneMyRoutineListResponse>>(
    `/api/v1/my-routine/list/complete/${myRoutineListId}`,
    {},
    {
      params: { date },
    },
  );

  return response.data;
};

// 개인루틴 리스트 안 루틴 만들기 API
export const makeRoutineToMyRoutineList = async (
  myRoutineListId: string,
  data: CreatePersonalRoutineDetailRequest,
): Promise<ApiResponse<CreatePersonalRoutineDetailResponse>> => {
  const response = await apiClient.post<
    ApiResponse<CreatePersonalRoutineDetailResponse>
  >(`/api/v1/my-routine/routine/${myRoutineListId}`, data);

  return response.data;
};

// 개인루틴 상세 조회 API
export const getPersonalRoutineDetails = async (
  myRoutineListId: string,
  params: { date: string },
): Promise<ApiResponse<any>> => {
  const { date } = params;

  const response = await apiClient.get<ApiResponse<any>>(
    `/api/v1/my-routine/list/routine/${myRoutineListId}`,
    {
      params: { date },
    },
  );

  return response.data;
};
