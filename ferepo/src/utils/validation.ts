/**
 * 비밀번호 유효성 검사
 * @param password - 검사할 비밀번호
 * @returns 비밀번호가 유효한지 여부
 */
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{8,20}$/;
  return passwordRegex.test(password);
};

/**
 * 이메일 유효성 검사
 * @param email - 검사할 이메일
 * @returns 이메일이 유효한지 여부
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 닉네임 유효성 검사
 * @param nickname - 검사할 닉네임
 * @returns 닉네임이 유효한지 여부
 */
export const validateNickname = (nickname: string): boolean => {
  const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/;
  return nicknameRegex.test(nickname);
};

/**
 * 비밀번호 검증 결과 객체
 */
export interface PasswordValidationResult {
  isValid: boolean;
  message: string;
}

/**
 * 비밀번호 상세 검증 (에러 메시지 포함)
 * @param password - 검사할 비밀번호
 * @returns 검증 결과 객체
 */
export const validatePasswordWithMessage = (
  password: string,
): PasswordValidationResult => {
  if (!password) {
    return {
      isValid: false,
      message: '',
    };
  }

  if (password.length < 8 || password.length > 20) {
    return {
      isValid: false,
      message: '비밀번호는 8자 이상 20자 이하로 입력해주세요.',
    };
  }

  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      message: '비밀번호에는 소문자 및 숫자를 모두 포함해야 합니다.',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};
