import { create } from 'zustand';

// 웹 환경 체크
const isWeb = typeof window !== 'undefined';

// 지출 카테고리 타입 정의
export type ExpenseCategory =
  | 'food'
  | 'transportation'
  | 'shopping'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'other';

// 금융 상태 타입 정의
interface FinanceState {
  // 상태
  currentBalance: number;
  monthlyBudget: number;
  totalExpenses: number;
  selectedCategory: ExpenseCategory | null;
  isLoading: boolean;

  // 액션 (상태를 변경하는 함수들)
  setCurrentBalance: (balance: number) => void;
  setMonthlyBudget: (budget: number) => void;
  setTotalExpenses: (expenses: number) => void;
  setSelectedCategory: (category: ExpenseCategory | null) => void;
  setLoading: (loading: boolean) => void;
  addExpense: (amount: number) => void;
  resetFinanceState: () => void;
}

// Zustand 스토어 생성
export const useFinanceStore = create<FinanceState>((set, get) => ({
  // 초기 상태
  currentBalance: 0,
  monthlyBudget: 0,
  totalExpenses: 0,
  selectedCategory: null,
  isLoading: false,

  // 액션들
  setCurrentBalance: (balance) => set({ currentBalance: balance }),

  setMonthlyBudget: (budget) => set({ monthlyBudget: budget }),

  setTotalExpenses: (expenses) => set({ totalExpenses: expenses }),

  setSelectedCategory: (category) => set({ selectedCategory: category }),

  setLoading: (loading) => set({ isLoading: loading }),

  addExpense: (amount) => {
    const { totalExpenses, currentBalance } = get();
    set({
      totalExpenses: totalExpenses + amount,
      currentBalance: Math.max(0, currentBalance - amount),
    });
  },

  resetFinanceState: () =>
    set({
      currentBalance: 0,
      monthlyBudget: 0,
      totalExpenses: 0,
      selectedCategory: null,
      isLoading: false,
    }),
}));

// 모바일 환경에서만 persist 적용
if (!isWeb) {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  const { persist, createJSONStorage } = require('zustand/middleware');

  const persistedStore = persist(useFinanceStore, {
    name: 'finance-storage',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state: FinanceState) => ({
      currentBalance: state.currentBalance,
      monthlyBudget: state.monthlyBudget,
      totalExpenses: state.totalExpenses,
    }),
  });

  // 기존 스토어를 persisted 스토어로 교체
  Object.assign(useFinanceStore, persistedStore);
}
