import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 루틴 타입 정의
export type RoutineType = 'personal' | 'group';

// 루틴 필터 타입 정의
export type RoutineFilter = 'all' | 'personal' | 'group';

// 루틴 상태 타입 정의
interface RoutineState {
  // 상태
  selectedDate: Date;
  routineFilter: RoutineFilter;
  isCalendarOpen: boolean;
  isLoading: boolean;
  activeRoutineId: string | null;
  isEditMode: boolean; // 루틴 수정 모드 상태 추가
  activeRoutineCompletedIndices: number[]; // 실행 중 완료된 세부 루틴 인덱스

  // 액션 (상태를 변경하는 함수들)
  setSelectedDate: (date: Date) => void;
  setRoutineFilter: (filter: RoutineFilter) => void;
  setCalendarOpen: (isOpen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setActiveRoutineId: (id: string | null) => void;
  setEditMode: (isEdit: boolean) => void; // 수정 모드 설정 액션 추가
  markActiveRoutineTaskCompleted: (index: number) => void;
  resetActiveRoutineProgress: () => void;
  resetRoutineState: () => void;
}

// Zustand 스토어 생성
export const useRoutineStore = create<RoutineState>((set) => ({
  // 초기 상태
  selectedDate: new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  ),
  routineFilter: 'all',
  isCalendarOpen: false,
  isLoading: false,
  activeRoutineId: null,
  isEditMode: false, // 초기 수정 모드 상태
  activeRoutineCompletedIndices: [],

  // 액션들
  setSelectedDate: (date) => set({ selectedDate: date }),

  setRoutineFilter: (filter) => set({ routineFilter: filter }),

  setCalendarOpen: (isOpen) => set({ isCalendarOpen: isOpen }),

  setLoading: (loading) => set({ isLoading: loading }),

  setActiveRoutineId: (id) => set({ activeRoutineId: id }),

  setEditMode: (isEdit) => set({ isEditMode: isEdit }),

  markActiveRoutineTaskCompleted: (index) =>
    set((state) => ({
      activeRoutineCompletedIndices: Array.from(
        new Set([...state.activeRoutineCompletedIndices, index]),
      ),
    })),

  resetActiveRoutineProgress: () => set({ activeRoutineCompletedIndices: [] }),

  resetRoutineState: () =>
    set({
      selectedDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
      ),
      routineFilter: 'all',
      isCalendarOpen: false,
      isLoading: false,
      activeRoutineId: null,
      isEditMode: false, // 상태 초기화 시 수정 모드도 초기화
      activeRoutineCompletedIndices: [],
    }),
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useRoutineStore, {
    name: 'routine-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: RoutineState) => ({
      selectedDate: state.selectedDate,
      routineFilter: state.routineFilter,
      activeRoutineId: state.activeRoutineId,
      // isEditMode는 세션성 UI 상태이므로 persist 대상에서 제외
      // activeRoutineCompletedIndices 는 세션성 데이터라 persist 제외
    }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useRoutineStore, persistedStore);
}
