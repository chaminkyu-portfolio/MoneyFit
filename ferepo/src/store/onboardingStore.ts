import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 온보딩 데이터 타입 정의
interface OnboardingData {
  isCompleted: boolean;
}

// 온보딩 스토어 상태 타입 정의
interface OnboardingState {
  // 상태
  onboardingData: OnboardingData;
  isLoading: boolean;

  // 액션 (상태를 변경하는 함수들)
  setLoading: (loading: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

// Zustand 스토어 생성
export const useOnboardingStore = create<OnboardingState>((set) => ({
  // 초기 상태
  onboardingData: {
    isCompleted: false,
  },
  isLoading: false,

  // 액션들
  setLoading: (loading) => set({ isLoading: loading }),

  completeOnboarding: () =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, isCompleted: true },
    })),

  resetOnboarding: () =>
    set({
      onboardingData: {
        isCompleted: false,
      },
      isLoading: false,
    }),
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useOnboardingStore, {
    name: 'onboarding-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: OnboardingState) => ({
      onboardingData: state.onboardingData,
    }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useOnboardingStore, persistedStore);
}
