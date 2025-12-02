import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { spinRoulette, getMyTickets, RouletteSpinRequest } from '../../api/roulette';

/**
 * 룰렛 스핀 API 훅
 *
 * @returns 룰렛 스핀 뮤테이션 객체
 *
 * @example
 * ```typescript
 * const { mutate: spinRoulette, isLoading, error } = useRouletteSpin();
 *
 * // 룰렛 스핀 요청
 * spinRoulette({ ticketCost: 5 }, {
 *   onSuccess: (data) => {
 *     console.log('룰렛 스핀 성공:', data);
 *   },
 *   onError: (error) => {
 *     console.error('룰렛 스핀 실패:', error);
 *   }
 * });
 * ```
 */
export const useRouletteSpin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request?: RouletteSpinRequest) => spinRoulette(request),
    onSuccess: () => {
      // 티켓 정보와 포인트 정보를 다시 조회
      queryClient.invalidateQueries({ queryKey: ['myTickets'] });
      queryClient.invalidateQueries({ queryKey: ['myPoint'] });
    },
    onError: (error: any) => {
      // 에러 코드별 처리
      if (error?.response?.status === 400) {
        console.error('🔍 티켓이 부족하거나 잘못된 요청입니다.');
      } else if (error?.response?.status === 401) {
        console.error('🔍 인증에 실패했습니다.');
      } else if (error?.response?.status === 409) {
        console.error('🔍 이미 오늘 룰렛을 사용하셨습니다.');
      } else if (error?.response?.status === 500) {
        console.error('🔍 서버 오류가 발생했습니다.');
      } else {
        console.error('🔍 룰렛 스핀 중 오류가 발생했습니다:', error);
      }
    },
  });
};

/**
 * 내 티켓 조회 API 훅
 *
 * @returns 내 티켓 조회 쿼리 객체
 */
export const useMyTickets = () => {
  return useQuery({
    queryKey: ['myTickets'],
    queryFn: getMyTickets,
    staleTime: 1 * 60 * 1000, // 1분간 fresh 상태 유지
    gcTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};
