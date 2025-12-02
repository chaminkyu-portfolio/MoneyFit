import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQueryClient } from '@tanstack/react-query';

import { theme } from '../../styles/theme';

import Header from '../../components/common/Header';
import CustomInput from '../../components/common/CustomInput';
import CustomButton from '../../components/common/CustomButton';
import { FormGroup, Label } from '../../components/domain/auth/authFormStyles';
import { useSignIn } from '../../hooks/user/useUser';
import { useAuthStore, useOnboardingStore, useUserStore } from '../../store';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';

const EmailLoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [provider, setProvider] = useState('LOCAL');

  const { login, setAccessToken, setRefreshToken } = useAuthStore();
  const { completeOnboarding } = useOnboardingStore();
  const { setUserInfo } = useUserStore();
  const queryClient = useQueryClient();

  // 로그인 API hook
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = () => {
    if (!isFormValid) return;

    // 에러 메시지 초기화
    setErrorMessage('');

    // 로그인 API 호출
    signIn(
      {
        email: email,
        password: password,
        // provider: 'LOCAL',
      },
      {
        onSuccess: (data) => {
          console.log('🔍 로그인 성공 응답:', data);

          // 토큰 저장 (안전하게 처리)
          if (
            data.result &&
            data.result.accessToken &&
            data.result.refreshToken
          ) {
            console.log('🔍 토큰 추출 성공:', {
              accessToken: data.result.accessToken,
              refreshToken: data.result.refreshToken,
            });

            // React Query 캐시 초기화 (이전 사용자 데이터 제거)
            queryClient.clear();
            console.log('🔍 React Query 캐시 초기화 완료');

            setAccessToken(data.result.accessToken);
            setRefreshToken(data.result.refreshToken);
            console.log('🔍 토큰 저장 완료');

            // 온보딩 완료 상태로 설정 (로그인 시 온보딩 비활성화)
            completeOnboarding();

            // 사용자 정보 저장 (로그인 시 기본 정보 설정)
            setUserInfo({
              nickname: '사용자', // 기본 닉네임
              email: email,
              profileImage: undefined,
              points: 0,
              isMarketing: false, // 기본값
              accountCertificationStatus: false, // 기본값
            });

            // 로그인 상태 변경
            login();

            // 최종 스토어 상태 확인
            setTimeout(() => {
              const currentState = useAuthStore.getState();
              console.log('🔍 최종 스토어 상태:', {
                accessToken: currentState.accessToken,
                refreshToken: currentState.refreshToken,
                isLoggedIn: currentState.isLoggedIn,
              });
            }, 100);
          } else {
            console.error('🔍 토큰이 응답에 없습니다:', data);
            setErrorMessage('로그인 응답에 토큰이 없습니다.');
          }
        },
        onError: (error: any) => {
          console.error('로그인 실패:', error);

          // 간단한 에러 처리
          const message = handleApiError(error, false); // Alert 표시 안함
          setErrorMessage(message);
        },
      },
    );
  };

  return (
    <Container>
      <Header title="이메일로 로그인" onBackPress={() => navigation.goBack()} />

      <ContentWrapper>
        <TitleWrapper>
          <SubTitle>소비 습관 플래너</SubTitle>
          <MainTitle>
            <HighlightText>머니핏</HighlightText>
          </MainTitle>
          {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
        </TitleWrapper>

        <FormContainer>
          <FormGroup>
            <Label>이메일</Label>
            <CustomInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@example.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>비밀번호</Label>
            <CustomInput
              value={password}
              onChangeText={setPassword}
              placeholder="비밀번호를 입력해주세요."
              isPassword={true}
            />
          </FormGroup>
        </FormContainer>

        <ButtonWrapper>
          <CustomButton
            text={isSigningIn ? '로그인 중...' : '로그인'}
            onPress={handleLogin}
            disabled={!isFormValid || isSigningIn}
            backgroundColor={
              isFormValid && !isSigningIn
                ? theme.colors.primary
                : theme.colors.gray200
            }
            textColor={
              isFormValid && !isSigningIn
                ? theme.colors.white
                : theme.colors.gray500
            }
          />

          <Footer>
            <FooterLink onPress={() => navigation.navigate('EmailInput')}>
              회원가입
            </FooterLink>
            <Separator>|</Separator>
            <FooterLink onPress={() => navigation.navigate('FindId')}>
              아이디 찾기
            </FooterLink>
            <Separator>|</Separator>
            <FooterLink onPress={() => navigation.navigate('FindPassword')}>
              비밀번호 찾기
            </FooterLink>
          </Footer>
        </ButtonWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default EmailLoginScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
`;

const ContentWrapper = styled.ScrollView.attrs({
  contentContainerStyle: {
    padding: 24,
  },
  keyboardShouldPersistTaps: 'handled',
})``;

const TitleWrapper = styled.View`
  align-items: flex-start;
  margin-top: 40px;
  margin-bottom: 60px;
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 32px;
  color: ${theme.colors.gray900};
`;

const MainTitle = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: 32px;
  color: ${theme.colors.gray900};
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const FormContainer = styled.View`
  width: 100%;
`;

const ButtonWrapper = styled.View`
  /* padding: 0; */
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: 24px;
`;

const FooterLink = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: 14px;
  color: ${theme.colors.gray600};
`;

const Separator = styled.Text`
  margin: 0 12px;
  color: ${theme.colors.gray300};
`;

const ErrorMessage = styled.Text`
  font-size: 14px;
  font-family: ${theme.fonts.Regular};
  color: ${theme.colors.error};
  margin-top: 8px;
  text-align: center;
`;
