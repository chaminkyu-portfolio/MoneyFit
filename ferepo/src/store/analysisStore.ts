import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 분석 기간 타입 정의
export type AnalysisPeriod = 'week' | 'month' | 'year';

// 분석 차트 타입 정의
export type ChartType = 'expense' | 'routine' | 'achievement';

// 분석 상태 타입 정의
interface AnalysisState {
  // 상태
  selectedPeriod: AnalysisPeriod;
  selectedChartType: ChartType;
  isLoading: boolean;
  lastAnalysisDate: Date | null;

  // 액션 (상태를 변경하는 함수들)
  setSelectedPeriod: (period: AnalysisPeriod) => void;
  setSelectedChartType: (chartType: ChartType) => void;
  setLoading: (loading: boolean) => void;
  setLastAnalysisDate: (date: Date) => void;
  resetAnalysisState: () => void;
}

// Zustand 스토어 생성
export const useAnalysisStore = create<AnalysisState>((set) => ({
  // 초기 상태
  selectedPeriod: 'week',
  selectedChartType: 'expense',
  isLoading: false,
  lastAnalysisDate: null,

  // 액션들
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),

  setSelectedChartType: (chartType) => set({ selectedChartType: chartType }),

  setLoading: (loading) => set({ isLoading: loading }),

  setLastAnalysisDate: (date) => set({ lastAnalysisDate: date }),

  resetAnalysisState: () =>
    set({
      selectedPeriod: 'week',
      selectedChartType: 'expense',
      isLoading: false,
      lastAnalysisDate: null,
    }),
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useAnalysisStore, {
    name: 'analysis-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: AnalysisState) => ({
      selectedPeriod: state.selectedPeriod,
      selectedChartType: state.selectedChartType,
      lastAnalysisDate: state.lastAnalysisDate,
    }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useAnalysisStore, persistedStore);
}
