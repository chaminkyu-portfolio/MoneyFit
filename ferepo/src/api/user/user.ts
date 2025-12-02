import apiClient from '../client';
import {
  ApiResponse,
  SignInRequest,
  SignInResponse,
  SignUpRequest,
  SignUpResponse,
  ReissueRequest,
  ReissueResponse,
  MyPageResetPasswordRequest,
  MyPageResetPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  ResetNicknameRequest,
  ResetNicknameResponse,
  MailSendRequest,
  MailSendResponse,
  MailSendForPasswordRequest,
  MailSendForPasswordResponse,
  AuthCheckRequest,
  AuthCheckResponse,
  MyInfoResponse,
  UpdateIsMarketingRequest,
  UpdateIsMarketingResponse,
  UpdateProfileImageRequest,
  UpdateProfileImageResponse,
  SendAccountCodeRequest,
  SendAccountCodeResponse,
  VerifyAccountCodeRequest,
  VerifyAccountCodeResponse,
  DeleteUserResponse,
  FcmTokenRequest,
  FcmTokenResponse,
  OauthCheckRequest,
} from '../../types/api';

// ===== 유저 API 함수들 =====

// 이메일 중복확인
export const checkEmailDuplicate = async (
  email: string,
): Promise<ApiResponse<string>> => {
  // 이메일 URL 인코딩
  const encodedEmail = encodeURIComponent(email);
  const url = `/api/v1/user/email-duplicate-check?email=${encodedEmail}`;

  const response = await apiClient.post<ApiResponse<string>>(url);
  return response.data;
};

// 닉네임 중복확인
export const checkNicknameDuplicate = async (
  nickname: string,
): Promise<ApiResponse<string>> => {
  // 닉네임 URL 인코딩
  const encodedNickname = encodeURIComponent(nickname);
  const response = await apiClient.post<ApiResponse<string>>(
    `/api/v1/user/nickname-duplicate-check?nickname=${encodedNickname}`,
  );
  return response.data;
};

// 로그인
export const signIn = async (
  data: SignInRequest,
): Promise<ApiResponse<SignInResponse>> => {
  const response = await apiClient.post<ApiResponse<SignInResponse>>(
    '/api/v1/user/sign-in',
    data,
  );
  return response.data;
};

// 회원가입
export const signUp = async (
  data: SignUpRequest,
): Promise<ApiResponse<SignUpResponse>> => {
  console.log('🔍 회원가입 API 호출:', '/api/v1/user/sign-up');
  console.log('🔍 회원가입 요청 데이터:', {
    email: data.email,
    password: data.password,
    nickname: data.nickname,
    profileImage: data.profileImage,
    roles: data.roles,
    isMarketing: data.isMarketing,
  });

  const response = await apiClient.post<ApiResponse<SignUpResponse>>(
    '/api/v1/user/sign-up',
    data,
  );

  console.log('🔍 회원가입 응답:', {
    status: response.status,
    data: response.data,
    isSuccess: response.data?.isSuccess,
    message: response.data?.message,
  });

  return response.data;
};

// 토큰 재발급
export const reissue = async (
  data: ReissueRequest,
): Promise<ApiResponse<ReissueResponse>> => {
  const response = await apiClient.post<ApiResponse<ReissueResponse>>(
    '/api/v1/user/token/reissue',
    data,
  );
  return response.data;
};

// 마이페이지 비밀번호 재설정
export const mypageResetPassword = async (
  data: MyPageResetPasswordRequest,
): Promise<ApiResponse<MyPageResetPasswordResponse>> => {
  const response = await apiClient.post<
    ApiResponse<MyPageResetPasswordResponse>
  >('/api/v1/user/mypage-password', data);
  return response.data;
};

// 비밀번호 찾기 후 재설정
export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ApiResponse<ResetPasswordResponse>> => {
  const response = await apiClient.patch<ApiResponse<ResetPasswordResponse>>(
    '/api/v1/user/password',
    data,
  );
  return response.data;
};

// 닉네임 재설정
export const resetNickname = async (
  data: ResetNicknameRequest,
): Promise<ApiResponse<ResetNicknameResponse>> => {
  const response = await apiClient.patch<ApiResponse<ResetNicknameResponse>>(
    `/api/v1/user/mypage-nickname?nickname=${encodeURIComponent(data.nickname)}`,
  );

  if (
    response?.data &&
    typeof response.data === 'object' &&
    'isSuccess' in response.data
  ) {
    return response.data;
  }

  const isOk = response?.status >= 200 && response?.status < 300;
  return {
    isSuccess: isOk,
    code: isOk ? 'COMMON200' : 'COMMON500',
    message: isOk ? '성공입니다.' : '실패했습니다.',
    result: isOk ? '닉네임이 변경되었습니다' : '닉네임 변경 실패',
  };
};

// 회원가입 인증메일 보내기
export const mailSend = async (
  data: MailSendRequest,
): Promise<ApiResponse<MailSendResponse>> => {
  const response = await apiClient.post<ApiResponse<MailSendResponse>>(
    '/api/v1/mail/send',
    data,
  );
  return response.data;
};

// 비밀번호 찾기 인증메일 보내기
export const mailSendForPassword = async (
  data: MailSendForPasswordRequest,
): Promise<ApiResponse<MailSendForPasswordResponse>> => {
  const response = await apiClient.post<
    ApiResponse<MailSendForPasswordResponse>
  >('/api/v1/mail/send-password', data);
  return response.data;
};

// 인증번호 확인
export const authCheck = async (
  data: AuthCheckRequest,
): Promise<ApiResponse<AuthCheckResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthCheckResponse>>(
    '/api/v1/mail/auth-check',
    data,
  );
  return response.data;
};

// 사용자 정보 조회
export const myInfo = async (): Promise<ApiResponse<MyInfoResponse>> => {
  const response = await apiClient.get<ApiResponse<MyInfoResponse>>(
    '/api/v1/user/my-info',
  );
  return response.data;
};

// 마케팅 수신동의 업데이트
export const updateIsMarketing = async (
  data: UpdateIsMarketingRequest,
): Promise<ApiResponse<UpdateIsMarketingResponse>> => {
  const response = await apiClient.patch<
    ApiResponse<UpdateIsMarketingResponse>
  >('/api/v1/user/marketing', data);
  return response.data;
};

// 프로필 이미지 업데이트
export const updateProfileImage = async (
  data: UpdateProfileImageRequest,
): Promise<ApiResponse<UpdateProfileImageResponse>> => {
  const response = await apiClient.put<ApiResponse<UpdateProfileImageResponse>>(
    '/api/v1/user/profileImage',
    data,
  );
  return response.data;
};

// 프로필 이미지 업로드 (백엔드를 통한 S3 업로드)
export const uploadProfileImage = async (
  imageFile: File | Blob,
  email: string,
): Promise<ApiResponse<{ imageUrl: string }>> => {
  const formData = new FormData();
  formData.append('image', imageFile, `profile_${Date.now()}.jpg`);
  formData.append('email', email);

  const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>(
    '/api/v1/user/upload-profile-image',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// 계좌 인증번호 전송 (1원 송금)
export const sendAccountCode = async (
  data: SendAccountCodeRequest,
): Promise<ApiResponse<SendAccountCodeResponse>> => {
  const response = await apiClient.post<ApiResponse<SendAccountCodeResponse>>(
    '/api/v1/user/accountCode',
    data,
  );
  return response.data;
};

// 계좌 인증번호 확인 (1원 송금 검증)
export const verifyAccountCode = async (
  data: VerifyAccountCodeRequest,
): Promise<ApiResponse<VerifyAccountCodeResponse>> => {
  const response = await apiClient.post<ApiResponse<VerifyAccountCodeResponse>>(
    '/api/v1/user/accountCode/verify',
    data,
  );
  return response.data;
};

// 회원탈퇴
export const deleteUser = async (): Promise<
  ApiResponse<DeleteUserResponse>
> => {
  const response = await apiClient.delete<ApiResponse<DeleteUserResponse>>(
    '/api/v1/user/delete',
  );
  return response.data;
};


// FCM 토큰 저장
export const accountVerification = async (
  data: FcmTokenRequest,
): Promise<ApiResponse<FcmTokenResponse>> => {
  const response = await apiClient.post<ApiResponse<FcmTokenResponse>>(
    '/api/v1/fcm/token',
    data,
  );
  return response.data;
};

export const checkOauth = async (
  data: OauthCheckRequest,
): Promise<ApiResponse<string>> => {
  console.log('🔍 소셜유저 회원가입 체크 API 호출:', '/api/v1/user/oauth-check');
  const response = await apiClient.post<ApiResponse<string>>(
    '/api/v1/user/oauth-check',
    data,
  );
  return response.data;
};
