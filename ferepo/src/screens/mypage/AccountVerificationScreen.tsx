import React, { useState, useEffect } from 'react';
import { Image, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../styles/theme';
import CustomButton from '../../components/common/CustomButton';
import Header from '../../components/common/Header';
import OtpInput, { OtpInputRef } from '../../components/common/OtpInput';
import Timer from '../../components/common/Timer';
import {
  useVerifyAccountCode,
  useSendAccountCode,
} from '../../hooks/user/useUser';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

const AccountVerificationScreen = ({ navigation, route }: any) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingCode, setIsLoadingCode] = useState(false);

  // route.params에서 계좌번호 가져오기
  const { accountNumber } = route.params || {};

  // 계좌 인증번호 확인 훅
  const { mutate: verifyAccountCode, isPending: isVerifying } =
    useVerifyAccountCode();

  // 계좌 인증번호 재전송 훅
  const { mutate: resendAccountCode, isPending: isResending } =
    useSendAccountCode();

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  const isButtonEnabled = code.length === 4;
  const isTimeUp = timeLeft === 0;

  // 타이머 로직 (UI 표시용) - useRef로 최적화
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const otpInputRef = React.useRef<OtpInputRef>(null);

  // 화면 진입 시 자동으로 1원 인증번호 요청
  useEffect(() => {
    if (accountNumber) {
      setIsLoadingCode(true);
      // 1원 인증번호 요청
      resendAccountCode(
        { account: accountNumber },
        {
          onSuccess: (data) => {
            console.log('🔍 계좌 인증번호 요청 성공:', data);
            setIsLoadingCode(false);

            // 5초 후 자동으로 인증번호 입력
            setTimeout(() => {
              setCode(data.result);
              // 마지막 입력창에 포커스 이동
              setTimeout(() => {
                otpInputRef.current?.focusLastInput();
              }, 100);
            }, 5000);
          },
          onError: (error) => {
            console.error('🔍 계좌 인증번호 요청 실패:', error);
            setIsLoadingCode(false);
            handleApiError(error);
            setErrorMessage('인증번호 요청에 실패했습니다.');
          },
        },
      );
    }
  }, [accountNumber, resendAccountCode, handleApiError]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeLeft]); // timeLeft를 의존성 배열에 추가

  const handleVerify = () => {
    if (!isButtonEnabled || isTimeUp) return;

    // 계좌 인증번호 확인 API 호출
    verifyAccountCode(
      { code },
      {
        onSuccess: (data) => {
          console.log('🔍 계좌 인증 성공:', data);
          // 성공 시 완료 화면으로 이동
          navigation.replace('Result', {
            type: 'success',
            title: '등록 성공',
            description: '계좌 등록을 성공적으로 완료했어요',
            nextScreen: 'ProfileEdit',
          });
        },
        onError: (error) => {
          console.error('🔍 계좌 인증 실패:', error);
          handleApiError(error);
          // 에러 메시지 설정
          setErrorMessage('인증번호가 올바르지 않습니다.');
        },
      },
    );
  };

  const handleCodeChange = (text: string) => {
    setCode(text);
    // 입력할 때마다 에러 메시지 초기화
    if (errorMessage) setErrorMessage('');
  };

  const handleResendCode = () => {
    if (!accountNumber) {
      setErrorMessage('계좌번호 정보가 없습니다.');
      return;
    }

    // 1원 입금 재발송 API 호출
    resendAccountCode(
      { account: accountNumber },
      {
        onSuccess: (data) => {
          console.log('🔍 계좌 인증번호 재전송 성공:', data);

          // 기존 타이머 정리
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          // 타이머 리셋 및 입력값 초기화
          setTimeLeft(180);
          setCode('');
          setErrorMessage('');

          // 첫 번째 입력창에 포커스 이동
          setTimeout(() => {
            otpInputRef.current?.focusFirstInput();
          }, 100);

          // 5초 후 자동으로 인증번호 입력
          setTimeout(() => {
            setCode(data.result);
            // 마지막 입력창에 포커스 이동
            setTimeout(() => {
              otpInputRef.current?.focusLastInput();
            }, 100);
          }, 5000);
        },
        onError: (error) => {
          console.error('🔍 계좌 인증번호 재전송 실패:', error);
          handleApiError(error);
          // 에러 메시지 설정
          setErrorMessage('인증번호 재전송에 실패했습니다.');
        },
      },
    );
  };

  return (
    <Container>
      <Header onBackPress={() => navigation.goBack()} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <Content>
          <Title>계좌 인증을 해주세요</Title>

          <Description>
            계좌 거래내역에서 입금한 1원의 입금자명을 확인 후{'\n'}
            4자리 숫자를 입력해 주세요
          </Description>

          <Timer timeLeft={timeLeft} isTimeUp={isTimeUp} />

          <OtpInput
            ref={otpInputRef}
            code={code}
            onChangeText={handleCodeChange}
            maxLength={4}
            autoFocus={true}
          />

          <ResendButton onPress={handleResendCode} disabled={isResending}>
            <ResendText disabled={isResending}>
              {isResending ? '재발송 중...' : '1원 입금 재발송'}
            </ResendText>
          </ResendButton>

          <ErrorContainer>
            {isTimeUp ? (
              <ErrorMessage>인증 시간이 만료되었습니다.</ErrorMessage>
            ) : errorMessage ? (
              <ErrorMessage>{errorMessage}</ErrorMessage>
            ) : null}
          </ErrorContainer>
        </Content>

        {/* 하단 버튼 */}
        <ButtonWrapper>
          <CustomButton
            text={isVerifying ? '인증 중...' : '인증하기'}
            onPress={handleVerify}
            disabled={!isButtonEnabled || isTimeUp || isVerifying}
            backgroundColor={
              isButtonEnabled && !isTimeUp && !isVerifying
                ? theme.colors.primary
                : theme.colors.gray200
            }
            textColor={
              isButtonEnabled && !isTimeUp && !isVerifying
                ? theme.colors.white
                : theme.colors.gray500
            }
          />
        </ButtonWrapper>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default AccountVerificationScreen;

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
  flex: 1;
  padding: 24px;
`;

const Title = styled.Text`
  font-size: ${theme.fonts.title}px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.gray900};
  line-height: 34px;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Description = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.gray600};
  line-height: 24px;
  margin-bottom: 16px;
`;

const ResendButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  align-self: flex-start;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const ResendText = styled.Text<{ disabled?: boolean }>`
  font-size: ${theme.fonts.caption}px;
  font-family: ${theme.fonts.Medium};
  color: ${(props) =>
    props.disabled ? theme.colors.gray400 : theme.colors.gray600};
  text-decoration-line: underline;
`;

const ErrorContainer = styled.View`
  height: 20px;
  justify-content: center;
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
`;

const ButtonWrapper = styled.View`
  padding: 24px;
`;
