import apiClient from '../client';
import { ApiResponse } from '../../types/api';
import { useAuthStore } from '../../store';
import {
  BuyProductRequest,
  BuyProductResponse,
  MyPointResponse,
  PostProductRequest,
  PostProductResponse,
  ShopListParams,
  ShopListResponse,
  ShopCategoryListParams,
  ShopCategoryListResponse,
  GetProductDetailResponse,
  AccountTransferRequest,
  AccountTransferResponse,
} from '../../types/api';

// ===== 포인트샵 API 함수들 =====

// 물건 결제하기
export const buyProduct = async (
  productId: string,
): Promise<ApiResponse<BuyProductResponse>> => {
  const response = await apiClient.post<ApiResponse<BuyProductResponse>>(
    `/api/v1/shop/buy/${productId}`,
  );
  return response.data;
};

// 내 포인트 조회
// Legacy: 인터셉터에 의존하여 토큰 자동 첨부
// export const myPoint = async (): Promise<ApiResponse<MyPointResponse>> => {
//   const response = await apiClient.get<ApiResponse<MyPointResponse>>(
//     '/api/v1/shop/my-point',
//   );
//   return response.data;
// };

// 헤더에 직접 토큰을 넣어 호출하는 방식
export const myPoint = async (): Promise<ApiResponse<MyPointResponse>> => {
  const { accessToken } = useAuthStore.getState();
  const config = accessToken
    ? { headers: { Authorization: `Bearer ${accessToken}` } }
    : {};
  const response = await apiClient.get<ApiResponse<MyPointResponse>>(
    '/api/v1/shop/my-point',
    config,
  );
  return response.data;
};

// 물건 등록하기
export const postProduct = async (
  data: PostProductRequest,
): Promise<ApiResponse<PostProductResponse>> => {
  const response = await apiClient.post<ApiResponse<PostProductResponse>>(
    '/api/v1/shop',
    data,
  );
  return response.data;
};

// 물건 전체보기
export const shopList = async (
  params: ShopListParams = {},
): Promise<ApiResponse<ShopListResponse>> => {
  const { page = 0, size = 10 } = params;
  const response = await apiClient.get<ApiResponse<ShopListResponse>>(
    '/api/v1/shop/list',
    {
      params: {
        page,
        size,
      },
    },
  );
  return response.data;
};

// 물건 카테고리별 전체보기
export const shopCategoryList = async (
  params: ShopCategoryListParams,
): Promise<ApiResponse<ShopCategoryListResponse>> => {
  const { category, page = 0, size = 10 } = params;
  const response = await apiClient.get<ApiResponse<ShopCategoryListResponse>>(
    `/api/v1/shop/list/${category}`,
    {
      params: {
        page,
        size,
      },
    },
  );
  return response.data;
};

// 물건 상세보기
export const getProductDetail = async (
  productId: string,
): Promise<ApiResponse<GetProductDetailResponse>> => {
  const response = await apiClient.get<ApiResponse<GetProductDetailResponse>>(
    `/api/v1/shop/${productId}`,
  );
  return response.data;
};

// 포인트 전환하기
export const accountTransfer = async (
  data: AccountTransferRequest,
): Promise<ApiResponse<AccountTransferResponse>> => {
  const response = await apiClient.post<ApiResponse<AccountTransferResponse>>(
    '/api/v1/shop/account-transfer',
    data,
  );
  return response.data;
};
