import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import Header from '../../../components/common/Header';
import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import { theme } from '../../../styles/theme';
import { useAuthStore } from '../../../store';
import { validateEmail } from '../../../utils/validation';
import { useCheckEmailDuplicate } from '../../../hooks/user/useUser';
import { useErrorHandler } from '../../../hooks/common/useErrorHandler';

const EmailInputScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldCheckDuplicate, setShouldCheckDuplicate] = useState(false);

  // Zustand 스토어에서 이메일 설정 함수 가져오기
  const { setSignupEmail, clearSignupData } = useAuthStore();

  // 뒤로가기 시 상태 초기화
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        // 화면을 벗어날 때 상태 초기화
        clearSignupData();
      };
    }, [clearSignupData]),
  );

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  // 이메일 중복 확인 API hook
  const {
    data: duplicateCheckData,
    isLoading: isCheckingDuplicate,
    error: duplicateCheckError,
    refetch: refetchDuplicateCheck,
  } = useCheckEmailDuplicate(email, shouldCheckDuplicate);

  // 이메일 형식 유효성 검사
  const isEmailValid = validateEmail(email);

  useEffect(() => {
    if (email.length > 0 && !isEmailValid) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
    } else {
      setErrorMessage('');
    }
  }, [email, isEmailValid]);

  // 이메일 중복 확인 결과 처리
  useEffect(() => {
    if (shouldCheckDuplicate && !isCheckingDuplicate) {
      if (duplicateCheckError) {
        // 간단한 에러 처리
        const message = handleApiError(duplicateCheckError, false); // Alert 표시 안함
        setErrorMessage(message);
        setShouldCheckDuplicate(false);
      } else if (duplicateCheckData) {
        // 중복 확인 성공 - 사용 가능한 이메일
        setErrorMessage('');
        setShouldCheckDuplicate(false);
        // 자동으로 다음 화면으로 이동
        handleEmailVerified();
      }
    }
  }, [
    shouldCheckDuplicate,
    isCheckingDuplicate,
    duplicateCheckData,
    duplicateCheckError,
    handleApiError,
  ]);

  const handleNext = () => {
    if (isEmailValid) {
      // 이메일 중복 확인 실행
      setShouldCheckDuplicate(true);
      refetchDuplicateCheck();
    }
  };

  // 중복 확인이 성공했을 때만 다음 화면으로 이동
  const handleEmailVerified = () => {
    if (isEmailValid && !errorMessage && !isCheckingDuplicate) {
      // Zustand 스토어에 이메일 저장
      setSignupEmail(email);
      console.log('🔍 이메일 저장됨:', email);

      // 저장 후 스토어 상태 확인
      const currentState = useAuthStore.getState();
      console.log('🔍 이메일 저장 후 스토어 상태:', currentState.signupData);

      // 이메일 인증 화면으로 이동 (자동으로 인증메일 발송됨)
      navigation.navigate('EmailVerification', { email });
    }
  };

  return (
    <Container>
      <Header
        onBackPress={() => navigation.goBack()}
        rightComponent={<ProgressText>1/7</ProgressText>}
      />

      <Content>
        <Title>
          만나서 반가워요.{'\n'}
          이메일을 입력해주세요!
        </Title>
      </Content>

      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}

      <CenterContent>
        <CustomInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@example.com"
          maxLength={30}
        />
      </CenterContent>

      <ButtonWrapper>
        <CustomButton
          text={isCheckingDuplicate ? '확인 중...' : '다음'}
          onPress={handleNext}
          disabled={!isEmailValid || isCheckingDuplicate}
          backgroundColor={
            isEmailValid && !isCheckingDuplicate
              ? theme.colors.primary
              : theme.colors.gray200
          }
          textColor={
            isEmailValid && !isCheckingDuplicate
              ? theme.colors.white
              : theme.colors.gray500
          }
        />
      </ButtonWrapper>
    </Container>
  );
};

export default EmailInputScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ProgressText = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
`;

const Content = styled.View`
  padding: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 12px;
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  position: absolute;
  top: 200px;
  left: 24px;
  right: 24px;
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const CenterContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 24px;
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
