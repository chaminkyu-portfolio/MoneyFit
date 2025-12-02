import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiError } from '../types/api';
import { useAuthStore } from '../store';
import errorHandler from '../utils/errorHandler';

// AxiosRequestConfig 타입 확장
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// API 기본 URL (환경에 따라 변경 필요)
const API_BASE_URL = 'https://j13e207.p.ssafy.io'; // 실제 백엔드 서버 URL
// const API_BASE_URL = 'http://localhost:8070'; // 실제 백엔드 서버 URL

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 모든 API 요청 URL 로깅
    console.log('🔍 API 요청 URL:', config.url);

    // 인증이 필요 없는 API들은 토큰 제외
    const authNotRequired = [
      '/api/v1/user/sign-in',
      '/api/v1/user/sign-up',
      '/api/v1/user/email-duplicate-check',
      '/api/v1/user/nickname-duplicate-check',
      '/api/v1/user/oauth-check',
    ];

    const isAuthNotRequired = authNotRequired.some((path) =>
      config.url?.includes(path),
    );

    // 토큰이 필요 없는 API가 아니면 토큰 추가
    if (!isAuthNotRequired) {
      const token = getAuthToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 401 에러이고 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 재발급 시도
        const { accessToken, refreshToken } = useAuthStore.getState();

        if (refreshToken) {
          console.log('토큰 재발급 시도...');

          // 토큰 재발급 API 호출
          const reissueResponse = await axios.post(
            `${API_BASE_URL}/api/v1/user/token/reissue`,
            {
              accessToken: accessToken,
              refreshToken: refreshToken,
            },
          );

          if (reissueResponse.data.isSuccess) {
            // 새로운 토큰 저장
            const { setAccessToken, setRefreshToken } = useAuthStore.getState();
            setAccessToken(reissueResponse.data.result.accessToken);
            setRefreshToken(reissueResponse.data.result.refreshToken);

            console.log('토큰 재발급 성공');

            // 원래 요청 재시도
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${reissueResponse.data.result.accessToken}`;
            }
            return apiClient(originalRequest);
          }
        }
      } catch (reissueError) {
        console.log('토큰 재발급 실패:', reissueError);
      }

      // 토큰 재발급 실패 시 로그아웃
      const { logout } = useAuthStore.getState();
      logout();
    }

    // 공통 에러 처리 (weekly-point 4xx 에러는 제외)
    const isWeeklyPointError = error.config?.url?.includes('/api/v1/analysis/weekly-point');
    const is4xxError = error.response?.status >= 400 && error.response?.status < 500;
    
    if (!(isWeeklyPointError && is4xxError)) {
      try {
        errorHandler.handleApiError(error, {
          logError: true,
        });
      } catch (handlerError) {
        console.error('Error handler failed:', handlerError);
      }
    }

    return Promise.reject(error);
  },
);

// 인증 토큰 가져오기 함수 (Zustand store에서 가져오기)
function getAuthToken(): string | null {
  const { accessToken } = useAuthStore.getState();
  return accessToken;
}

export default apiClient;
