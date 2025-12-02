import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 계좌 정보 타입 정의
interface AccountInfo {
  hasAccount: boolean;
  accountNumber: string;
  bankName?: string;
  balance?: number;
}

// 사용자 정보 타입 정의
interface UserInfo {
  id?: string;
  nickname: string;
  email: string;
  profileImage?: string;
  points: number;
  age?: number;
  accountInfo?: AccountInfo;
  notificationConsent?: boolean;
  bankAccount?: string;
  isMarketing: boolean;
  accountCertificationStatus: boolean;
  universityId?: number;
  majorId?: number;
  university?: string;
  major?: string;
}

// 사용자 상태 타입 정의
interface UserState {
  // 상태
  userInfo: UserInfo | null;
  isLoading: boolean;

  // 액션 (상태를 변경하는 함수들)
  setUserInfo: (userInfo: UserInfo) => void;
  updateUserInfo: (updates: Partial<UserInfo>) => void;
  addPoints: (points: number) => void;
  deductPoints: (points: number) => void;
  setAccountInfo: (accountInfo: AccountInfo) => void;
  updateAccountInfo: (updates: Partial<AccountInfo>) => void;
  setLoading: (loading: boolean) => void;
  clearUserInfo: () => void;
}

// Zustand 스토어 생성
export const useUserStore = create<UserState>((set) => ({
  // 초기 상태
  userInfo: null,
  isLoading: false,

  // 액션들
  setUserInfo: (userInfo) => {
    console.log('🔍 setUserInfo 호출:', userInfo);
    set({ userInfo });
  },

  updateUserInfo: (updates) =>
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, ...updates } : null,
    })),

  addPoints: (points) =>
    set((state) => ({
      userInfo: state.userInfo
        ? { ...state.userInfo, points: state.userInfo.points + points }
        : null,
    })),

  deductPoints: (points) =>
    set((state) => ({
      userInfo: state.userInfo
        ? {
            ...state.userInfo,
            points: Math.max(0, state.userInfo.points - points),
          }
        : null,
    })),

  setAccountInfo: (accountInfo) =>
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, accountInfo } : null,
    })),

  updateAccountInfo: (updates) =>
    set((state) => ({
      userInfo:
        state.userInfo && state.userInfo.accountInfo
          ? {
              ...state.userInfo,
              accountInfo: { ...state.userInfo.accountInfo, ...updates },
            }
          : state.userInfo,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearUserInfo: () => {
    console.log('🔍 clearUserInfo 호출');
    set({ userInfo: null, isLoading: false });

    // AsyncStorage에서도 제거
    if (!isWeb) {
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage');
        AsyncStorage.removeItem('user-storage');
        console.log('🔍 user-storage AsyncStorage에서 제거됨');
      } catch (error) {
        console.log('🔍 AsyncStorage 제거 실패:', error);
      }
    }
  },
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useUserStore, {
    name: 'user-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: UserState) => ({ userInfo: state.userInfo }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useUserStore, persistedStore);
}
