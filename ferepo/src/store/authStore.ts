import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// persist 미들웨어 추가
let persist: any = null;
let createJSONStorage: any = null;

if (!isWeb) {
  try {
    const persistModule = require('zustand/middleware/persist');
    persist = persistModule.persist;
    createJSONStorage = persistModule.createJSONStorage;
  } catch (error) {
    console.log('persist 미들웨어 로드 실패:', error);
  }
}

// 회원가입 데이터 타입 정의
interface SignupData {
  email: string;
  password: string;
  nickname: string;
  age: number | null;
  profileImage: string | null;
  isMarketing: boolean;
}

// 인증 상태 타입 정의
interface AuthState {
  // 상태
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  signupData: SignupData;

  // 액션 (상태를 변경하는 함수들)
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  login: () => void;
  logout: () => void;

  // Signup related actions
  setSignupEmail: (email: string) => void;
  setSignupPassword: (password: string) => void;
  setSignupNickname: (nickname: string) => void;
  setSignupAge: (age: number) => void;
  setSignupProfileImage: (profileImage: string | null) => void;
  setSignupMarketing: (isMarketing: boolean) => void;
  clearSignupData: () => void;

  // 디버깅용: 현재 토큰 상태 확인
  debugTokenState: () => void;
}

// Zustand 스토어 생성
const createAuthStore = (set: any, get: any) => ({
  // 초기 상태
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  signupData: {
    email: '',
    password: '',
    nickname: '',
    age: null,
    profileImage: null,
    isMarketing: false,
  },

  // 액션들
  setAccessToken: (token: string) => {
    console.log('🔍 AccessToken 저장:', token);
    set({ accessToken: token });
    console.log('🔍 저장 후 스토어 상태:', get());
  },

  setRefreshToken: (token: string) => {
    console.log('🔍 RefreshToken 저장:', token);
    set({ refreshToken: token });
    console.log('🔍 저장 후 스토어 상태:', get());
  },

  setLoggedIn: (loggedIn: boolean) => set({ isLoggedIn: loggedIn }),

  login: () => {
    console.log('🔍 로그인 상태 변경: true');
    set({
      isLoggedIn: true,
    });
    console.log('🔍 로그인 후 전체 스토어 상태:', get());
  },

  logout: () => {
    console.log('🔍 로그아웃 실행');
    set({
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
      signupData: {
        email: '',
        password: '',
        nickname: '',
        age: null,
        profileImage: null,
        isMarketing: false,
      },
    });

    // userStore도 초기화
    if (!isWeb) {
      try {
        const { useUserStore } = require('./userStore');
        const { clearUserInfo } = useUserStore.getState();
        clearUserInfo();
      } catch (error) {
        console.log('userStore 초기화 실패:', error);
      }
    }

    console.log('🔍 로그아웃 완료 - 모든 스토어 초기화됨');
  },

  // Signup actions
  setSignupEmail: (email: string) =>
    set((state: any) => ({
      signupData: { ...state.signupData, email },
    })),

  setSignupPassword: (password: string) =>
    set((state: any) => ({
      signupData: { ...state.signupData, password },
    })),

  setSignupNickname: (nickname: string) =>
    set((state: any) => ({
      signupData: { ...state.signupData, nickname },
    })),

  setSignupAge: (age: number) =>
    set((state: any) => ({
      signupData: { ...state.signupData, age },
    })),

  setSignupProfileImage: (profileImage: string | null) =>
    set((state: any) => ({
      signupData: { ...state.signupData, profileImage },
    })),

  setSignupMarketing: (isMarketing: boolean) =>
    set((state: any) => ({
      signupData: { ...state.signupData, isMarketing },
    })),

  clearSignupData: () =>
    set({
      signupData: {
        email: '',
        password: '',
        nickname: '',
        age: null,
        profileImage: null,
        isMarketing: false,
      },
    }),

  // 디버깅용: 현재 토큰 상태 확인
  debugTokenState: () => {
    const state = get();
    console.log('🔍 현재 토큰 상태:', {
      accessToken: state.accessToken
        ? `${state.accessToken.substring(0, 20)}...`
        : 'null',
      refreshToken: state.refreshToken
        ? `${state.refreshToken.substring(0, 20)}...`
        : 'null',
      isLoggedIn: state.isLoggedIn,
    });
    return state;
  },
});

// Zustand 스토어 생성
export const useAuthStore = create<AuthState>()(createAuthStore);

// persist 미들웨어 적용 (웹이 아닌 경우에만)
if (!isWeb && persist && createJSONStorage) {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage');

    const persistedStore = persist(useAuthStore, {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: AuthState) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isLoggedIn: state.isLoggedIn,
      }),
    });

    // Object.assign을 사용하여 스토어에 persist 기능 추가
    Object.assign(useAuthStore, persistedStore);
  } catch (error) {
    console.log('persist 적용 실패:', error);
  }
}
