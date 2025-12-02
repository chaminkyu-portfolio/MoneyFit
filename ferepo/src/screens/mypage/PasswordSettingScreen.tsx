import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../../components/common/Header';
import { theme } from '../../styles/theme';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { validatePassword } from '../../utils/validation';
import { useMyPageResetPassword } from '../../hooks/user';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

interface IPasswordSettingScreenProps {
  navigation: any;
}

const PasswordSettingScreen = ({ navigation }: IPasswordSettingScreenProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidForm, setIsValidForm] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [apiErrorMessage, setApiErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: resetPasswordMutate } = useMyPageResetPassword();
  const { handleApiError } = useErrorHandler();

  // 실시간 검증을 위한 useEffect (PasswordScreen과 동일한 방식)
  useEffect(() => {
    // 새 비밀번호 유효성 검사
    const isValidPassword = validatePassword(newPassword);

    // 새 비밀번호와 확인 비밀번호 일치 검사
    const isMatch = newPassword === confirmPassword;

    // 현재 비밀번호와 새 비밀번호가 같은지 체크
    const isDifferentFromCurrent = currentPassword !== newPassword;

    // 에러 메시지 설정 (PasswordScreen과 동일한 로직)
    if (newPassword && !isValidPassword) {
      setValidationMessage(
        '비밀번호는 영문 소문자, 숫자를 포함하여 8~20자여야 합니다.',
      );
    } else if (confirmPassword && !isMatch) {
      setValidationMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
    } else if (currentPassword && newPassword && !isDifferentFromCurrent) {
      setValidationMessage('현재 비밀번호와 다른 비밀번호를 입력해주세요.');
    } else {
      setValidationMessage('');
    }

    // 폼 유효성 설정
    setIsValidForm(
      Boolean(
        currentPassword &&
          newPassword &&
          confirmPassword &&
          isValidPassword &&
          isMatch &&
          isDifferentFromCurrent,
      ),
    );
  }, [currentPassword, newPassword, confirmPassword]);

  const handleCurrentPasswordChange = (text: string) => {
    setCurrentPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
  };

  const handlePasswordChange = async () => {
    if (!isValidForm) return;

    setIsLoading(true);
    setApiErrorMessage(''); // API 에러 메시지 초기화

    try {
      const response = await resetPasswordMutate({
        exsPassword: currentPassword,
        newPassword: newPassword,
      });

      if (response.isSuccess) {
        // 비밀번호 변경 완료 후 ResultScreen으로 이동
        navigation.replace('Result', {
          type: 'success',
          title: '변경 완료',
          description: '비밀번호를 성공적으로 변경했어요',
          nextScreen: 'ProfileEdit',
          onSuccess: () => {},
        });
      }
    } catch (error: any) {
      // 공통 에러 핸들러를 사용하여 에러 처리
      const errorMessage = handleApiError(error, false); // Alert 표시하지 않음

      // 에러 코드에 따른 메시지 처리
      if (error?.response?.data?.code === 'PASSWORD4000') {
        setApiErrorMessage('현재 비밀번호가 맞지 않습니다.');
      } else if (error?.response?.data?.code === 'PASSWORD4090') {
        setApiErrorMessage('기존 비밀번호와 동일합니다.');
      } else {
        // 그 외 모든 에러는 서버 오류 메시지 표시
        setApiErrorMessage(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header title="비밀번호 설정" onBackPress={() => navigation.goBack()} />

      <Content>
        <PasswordSection>
          <PasswordLabel>현재 비밀번호</PasswordLabel>
          <InputContainer>
            <CustomInput
              value={currentPassword}
              placeholder="현재 비밀번호를 입력하세요"
              maxLength={20}
              onChangeText={handleCurrentPasswordChange}
              isPassword={true}
            />
          </InputContainer>

          <PasswordLabel>새 비밀번호</PasswordLabel>
          <InputContainer>
            <CustomInput
              value={newPassword}
              placeholder="새 비밀번호를 입력하세요"
              maxLength={20}
              onChangeText={handleNewPasswordChange}
              isPassword={true}
            />
          </InputContainer>

          <PasswordLabel>새 비밀번호 확인</PasswordLabel>
          <InputContainer>
            <CustomInput
              value={confirmPassword}
              placeholder="새 비밀번호를 다시 입력하세요"
              maxLength={20}
              onChangeText={handleConfirmPasswordChange}
              isPassword={true}
            />
          </InputContainer>

          <InstructionText>
            <InstructionTextPart>* </InstructionTextPart>
            <HighlightedText>비밀번호는 8자 이상 20자 이하</HighlightedText>
            <InstructionTextPart>로 입력해주세요.</InstructionTextPart>
          </InstructionText>
          <InstructionText>
            <InstructionTextPart>* </InstructionTextPart>
            <HighlightedText>소문자 및 숫자를 모두 포함</HighlightedText>
            <InstructionTextPart>해야 합니다.</InstructionTextPart>
          </InstructionText>

          <ErrorContainer>
            {validationMessage ? (
              <ErrorText>{validationMessage}</ErrorText>
            ) : apiErrorMessage ? (
              <ErrorText>{apiErrorMessage}</ErrorText>
            ) : null}
          </ErrorContainer>
        </PasswordSection>
      </Content>

      <ButtonContainer>
        <CustomButton
          text={isLoading ? '변경 중...' : '비밀번호 변경'}
          onPress={handlePasswordChange}
          disabled={!isValidForm || isLoading}
          backgroundColor={
            isValidForm && !isLoading
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isValidForm && !isLoading
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonContainer>
    </Container>
  );
};

export default PasswordSettingScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const Content = styled.View`
  flex: 1;
  padding: 24px;
`;

const PasswordSection = styled.View`
  margin-top: 32px;
`;

const PasswordLabel = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.gray900};
  margin-bottom: 12px;
  margin-top: 24px;
`;

const InputContainer = styled.View`
  margin-bottom: 8px;
`;

const InstructionText = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const InstructionTextPart = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const HighlightedText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Medium};
  color: ${theme.colors.primary};
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
  margin-top: 8px;
`;

const ErrorText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonContainer = styled.View`
  padding: 24px;
`;
