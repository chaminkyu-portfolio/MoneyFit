import { useMutation } from '@tanstack/react-query';
import { givePoint } from '../../api/analysis';
import errorHandler from '../../utils/errorHandler';

/**
 * 연속 1주일 달성 포인트 지급 API 훅
 *
 * @returns 포인트 지급 뮤테이션 객체
 *
 * @example
 * ```typescript
 * const { mutate: givePoint, isLoading, error } = useGivePoint();
 *
 * // 포인트 지급 요청
 * givePoint(undefined, {
 *   onSuccess: (data) => {
 *     console.log('포인트 지급 성공:', data);
 *   },
 *   onError: (error) => {
 *     console.error('포인트 지급 실패:', error);
 *   }
 * });
 * ```
 */
export const useGivePoint = () => {
  return useMutation({
    mutationFn: givePoint,
    retry: false, // 중복 재시도 방지
    onError: (error: any) => {
      // 에러 코드별 처리
      if (error?.response?.status === 400) {
        // 400 에러는 조건 미충족으로 정상적인 경우이므로 조용히 처리
        console.log('🔍 포인트 지급 조건 미충족 (7일 연속 달성 필요)');
        // 사용자에게 에러 메시지를 보여주지 않음
      } else if (error?.response?.status === 409) {
        console.log('🔍 이미 해당 보상을 받으셨습니다.');
        // 409도 정상적인 경우이므로 조용히 처리
      } else if (error?.response?.status === 401) {
        console.error('🔍 인증에 실패했습니다.');
        errorHandler.showError('인증에 실패했습니다.\n잠시 후 다시 시도해주세요.', '인증 실패');
      } else if (error?.response?.status === 500) {
        console.error('🔍 서버 오류가 발생했습니다.');
        errorHandler.showError('서버에 일시적인 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.', '서버 오류');
      } else {
        console.error('🔍 포인트 지급 중 오류가 발생했습니다:', error);
        errorHandler.showError('포인트 지급에 실패하였습니다.\n잠시 후 다시 시도해주세요.', '포인트 지급 실패');
      }
    },
  });
};
