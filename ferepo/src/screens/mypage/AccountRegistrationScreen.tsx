import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useSendAccountCode } from '../../hooks/user/useUser';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';
import { useUserStore } from '../../store';

interface IAccountRegistrationScreenProps {
  navigation: any;
}

const AccountRegistrationScreen = ({
  navigation,
}: IAccountRegistrationScreenProps) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 사용자 정보에서 기존 계좌번호 가져오기
  const { userInfo } = useUserStore();

  // 계좌 인증번호 전송 훅
  const { mutate: sendAccountCode, isPending: isSendingCode } =
    useSendAccountCode();

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  // 실시간 검증 함수
  const validateAccount = (text: string) => {
    if (text.length > 0 && text.length < 10) {
      return '계좌번호는 10자리 이상 입력해주세요.';
    } else if (text.length >= 10 && text !== userInfo?.bankAccount) {
      return '등록된 계좌번호와 일치하지 않습니다.';
    }
    return '';
  };

  const handleAccountChange = (text: string) => {
    setAccountNumber(text);
    setErrorMessage(validateAccount(text));
  };

  const handleRequestAuth = () => {
    if (accountNumber.length >= 10 && accountNumber === userInfo?.bankAccount) {
      // 1원 인증 요청 API 호출
      sendAccountCode(
        { account: accountNumber },
        {
          onSuccess: (data) => {
            console.log('🔍 계좌 인증번호 전송 성공:', data);
            // 인증 화면으로 이동 (계좌번호도 함께 전달)
            navigation.navigate('AccountVerification', {
              accountNumber: accountNumber,
            });
          },
          onError: (error) => {
            console.error('🔍 계좌 인증번호 전송 실패:', error);
            handleApiError(error);
          },
        },
      );
    }
  };

  return (
    <Container>
      <Header title="계좌 등록" onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Content>
          <Title>계좌번호를{'\n'}입력해주세요.</Title>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        </Content>

        <CenterContent>
          <CustomInput
            value={accountNumber}
            onChangeText={handleAccountChange}
            placeholder="계좌번호를 입력하세요"
            maxLength={20}
          />
        </CenterContent>

        <ButtonWrapper>
          <CustomButton
            text={isSendingCode ? '인증번호 전송 중...' : '1원 인증 요청'}
            onPress={handleRequestAuth}
            disabled={
              accountNumber.length < 10 ||
              accountNumber !== userInfo?.bankAccount ||
              isSendingCode
            }
            backgroundColor={
              accountNumber.length >= 10 &&
              accountNumber === userInfo?.bankAccount &&
              !isSendingCode
                ? theme.colors.primary
                : theme.colors.gray200
            }
            textColor={
              accountNumber.length >= 10 &&
              accountNumber === userInfo?.bankAccount &&
              !isSendingCode
                ? theme.colors.white
                : theme.colors.gray500
            }
          />
        </ButtonWrapper>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AccountRegistrationScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
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

const Subtitle = styled.Text`
  font-size: 16px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  margin-top: 8px;
  text-align: flex-start;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
  margin-top: 8px;
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
