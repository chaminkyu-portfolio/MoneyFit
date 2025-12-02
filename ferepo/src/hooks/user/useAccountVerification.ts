import { useMutation } from '@tanstack/react-query';
import { accountVerification } from '../../api/user/user';
import { FcmTokenRequest } from '../../types/api';

export const useAccountVerification = () => {
  return useMutation({
    mutationFn: (data: FcmTokenRequest) => accountVerification(data),
    onError: (error: any) => {
      console.error('🔍 FCM 토큰 저장 실패:', error);

      // 에러 상태 코드별 처리
      if (error?.status === 400) {
        console.error('🔍 잘못된 요청 (400)');
      } else if (error?.status === 401) {
        console.error('🔍 인증 실패 (401)');
      } else if (error?.status === 500) {
        console.error('🔍 서버 오류 (500)');
      }
    },
  });
};
