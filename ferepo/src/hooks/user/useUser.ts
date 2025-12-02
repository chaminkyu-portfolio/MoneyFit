import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store';
import {
  checkEmailDuplicate,
  checkNicknameDuplicate,
  signIn,
  signUp,
  reissue,
  mypageResetPassword,
  resetPassword,
  resetNickname,
  mailSend,
  mailSendForPassword,
  authCheck,
  myInfo,
  updateIsMarketing,
  updateProfileImage,
  sendAccountCode,
  verifyAccountCode,
  deleteUser,
  // getMajors,
  // getUniversities,
  checkOauth,
} from '../../api/user/user';
import {
  SignInRequest,
  SignUpRequest,
  ReissueRequest,
  MyPageResetPasswordRequest,
  ResetPasswordRequest,
  ResetNicknameRequest,
  MailSendRequest,
  MailSendForPasswordRequest,
  AuthCheckRequest,
  MyInfoResponse,
  UpdateIsMarketingRequest,
  UpdateProfileImageRequest,
  SendAccountCodeRequest,
  VerifyAccountCodeRequest,
  OauthCheckRequest,
} from '../../types/api';

// ===== 유저 React Query Hooks =====

// 이메일 중복확인 훅
export const useCheckEmailDuplicate = (
  email: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ['checkEmailDuplicate', email],
    queryFn: () => checkEmailDuplicate(email),
    enabled: enabled && email.length > 0, // 이메일이 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  });
};

// 닉네임 중복확인 훅
export const useCheckNicknameDuplicate = (
  nickname: string,
  enabled: boolean = false,
) => {
  return useQuery({
    queryKey: ['checkNicknameDuplicate', nickname],
    queryFn: () => checkNicknameDuplicate(nickname),
    enabled: enabled && nickname.length > 0, // 닉네임이 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: false, // 재시도 안함
  });
};

// 로그인 훅
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignInRequest) => signIn(data),
    onSuccess: (data) => {
      // 로그인 성공 시 토큰 저장 및 캐시 무효화
      const { accessToken, refreshToken } = data.result;

      // TODO: 토큰을 스토어에 저장하는 로직 추가
      // useAuthStore.getState().setAccessToken(accessToken);
      // useAuthStore.getState().setRefreshToken(refreshToken);

      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// 회원가입 훅
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignUpRequest) => signUp(data),
    onSuccess: (data) => {
      // 회원가입 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 회원가입 성공 후 처리 로직 추가
      // 예: 자동 로그인, 환영 화면으로 이동 등
    },
  });
};

// 토큰 재발급 훅
export const useReissue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReissueRequest) => reissue(data),
    onSuccess: (data) => {
      // 토큰 재발급 성공 시 새로운 토큰 저장 및 캐시 무효화
      const { accessToken, refreshToken } = data.result;

      // TODO: 새로운 토큰을 스토어에 저장하는 로직 추가
      // useAuthStore.getState().setAccessToken(accessToken);
      // useAuthStore.getState().setRefreshToken(refreshToken);

      // 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// 마이페이지 비밀번호 재설정 훅
export const useMyPageResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MyPageResetPasswordRequest) => mypageResetPassword(data),
    onSuccess: (data) => {
      // 비밀번호 재설정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });
      console.log('🔍 비밀번호 변경 성공:', data);
    },
    onError: (error: any) => {
      console.error('🔍 비밀번호 변경 실패:', error);
      // 에러는 컴포넌트에서 handleApiError로 처리
    },
  });
};

// 비밀번호 찾기 후 재설정 훅
export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => resetPassword(data),
    onSuccess: (data) => {
      // 비밀번호 재설정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 비밀번호 재설정 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 로그인 화면으로 이동 등
    },
  });
};

// 닉네임 재설정 훅
export const useResetNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResetNicknameRequest) => resetNickname(data),
    onSuccess: (data) => {
      // 닉네임 재설정 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 닉네임 재설정 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 마이페이지로 이동 등
    },
  });
};

// 회원가입 인증메일 보내기 훅
export const useMailSend = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MailSendRequest) => mailSend(data),
    onSuccess: (data) => {
      // 인증메일 전송 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 인증메일 전송 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 인증코드 입력 화면으로 이동 등
    },
  });
};

// 비밀번호 찾기 인증메일 보내기 훅
export const useMailSendForPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MailSendForPasswordRequest) => mailSendForPassword(data),
    onSuccess: (data) => {
      // 인증메일 전송 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 인증메일 전송 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 인증코드 입력 화면으로 이동 등
    },
  });
};

// 인증번호 확인 훅
export const useAuthCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AuthCheckRequest) => authCheck(data),
    onSuccess: (data) => {
      // 인증번호 확인 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 인증번호 확인 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 다음 단계로 이동 등
    },
  });
};

// 사용자 정보 조회 훅
export const useMyInfo = () => {
  const { accessToken, refreshToken } = useAuthStore();

  return useQuery({
    queryKey: ['myInfo'],
    queryFn: myInfo,
    enabled: !!(accessToken && refreshToken), // 두 토큰이 모두 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
    retry: false, // 재시도 안함 (회원탈퇴 후 에러 방지)
  });
};

// 마케팅 수신동의 업데이트 훅
export const useUpdateIsMarketing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateIsMarketingRequest) => updateIsMarketing(data),
    onSuccess: (data) => {
      // 마케팅 수신동의 업데이트 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

// 프로필 이미지 업데이트 훅
export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileImageRequest) => updateProfileImage(data),
    onSuccess: (data) => {
      // 프로필 이미지 업데이트 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });

      // TODO: 프로필 이미지 업데이트 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시 등
    },
  });
};

// 계좌 인증번호 전송 훅 (1원 송금)
export const useSendAccountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SendAccountCodeRequest) => sendAccountCode(data),
    onSuccess: (data) => {
      // 계좌 인증번호 전송 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['account'] });

      // TODO: 계좌 인증번호 전송 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 인증 화면으로 이동 등
    },
  });
};

// 계좌 인증번호 확인 훅 (1원 송금 검증)
export const useVerifyAccountCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyAccountCodeRequest) => verifyAccountCode(data),
    onSuccess: (data) => {
      // 계좌 인증번호 확인 성공 시 관련 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['account'] });
      queryClient.invalidateQueries({ queryKey: ['myInfo'] });

      // TODO: 계좌 인증번호 확인 성공 후 처리 로직 추가
      // 예: 성공 메시지 표시, 계좌 등록 완료 등
    },
  });
};

// 회원탈퇴 훅
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: (data) => {
      console.log('🔍 회원탈퇴 성공:', data);
      // 회원탈퇴 성공 시 모든 캐시 초기화
      queryClient.clear();

      // 토큰 제거하여 myInfo API 호출 방지
      const { logout } = useAuthStore.getState();
      logout();
    },
    onError: (error) => {
      console.error('🔍 회원탈퇴 실패:', error);
    },
  });
};

// // 학과 검색 훅
// export const useGetMajors = (keyword: string) => {
//   return useQuery({
//     queryKey: ['getMajors', keyword],
//     queryFn: () => getMajors(keyword),
//     enabled: keyword.length > 0, // 키워드가 있을 때만 실행
//     staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
//     gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
//     retry: false, // 재시도 안함
//   });
// };

// // 대학교 검색 훅
// export const useGetUniversities = (keyword: string) => {
//   return useQuery({
//     queryKey: ['getUniversities', keyword],
//     queryFn: () => getUniversities(keyword),
//     enabled: keyword.length > 0, // 키워드가 있을 때만 실행
//     staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
//     gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
//     retry: false, // 재시도 안함
//   });
// };

// 소셜유저 회원가입 체크 훅
export const useCheckOauth = () => {
  return useMutation({
    mutationFn: (data: OauthCheckRequest) => checkOauth(data),
  });
};