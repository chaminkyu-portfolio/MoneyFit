import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import CustomButton from '../../components/common/CustomButton';
import { theme } from '../../styles/theme';
import { useAuthStore, useOnboardingStore, useUserStore } from '../../store';
import { useSignUp, useSignIn, useMyInfo } from '../../hooks/user/useUser';

// 모든 회원가입 데이터를 route.params로 받기
const WelcomeScreen = ({ navigation, route }: any) => {
  const { nickname, email, password, provider, providerId, age, profileImage } = route.params || {};
  const { login, signupData, setAccessToken, setRefreshToken } = useAuthStore();
  const { resetOnboarding, completeOnboarding } = useOnboardingStore();
  const { setUserInfo } = useUserStore();

  // 디버깅용 로그
  console.log('🔍 WelcomeScreen route.params:', route.params);

  // 회원가입 API hook
  const { mutate: signUp, isPending: isSigningUp } = useSignUp();
  // 로그인 API hook (자동 로그인용)
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();
  // 사용자 정보 조회 hook
  const { data: myInfoData } = useMyInfo();

  const handleStart = () => {
    // 회원가입 API 호출
    signUp(
      {
        email: email,
        password: password,
        nickname: nickname,
        age: age,
        profileImage: profileImage || '', // 기본 프로필 이미지
        roles: ['USER'], // 기본 역할
        provider: provider, // 로컬 회원가입
        providerId: providerId,
        isMarketing: signupData.isMarketing, // 마케팅 수신동의 상태
      },
      {
        onSuccess: (data) => {
          console.log('회원가입 성공:', data);

          // 회원가입 성공 후 자동 로그인
          signIn(
            {
              email: email,
              password: password,
              provider: provider,
            },
            {
              onSuccess: (loginData) => {
                console.log('🔍 자동 로그인 성공:', loginData);

                // 토큰 저장
                if (
                  loginData.result &&
                  loginData.result.accessToken &&
                  loginData.result.refreshToken
                ) {
                  setAccessToken(loginData.result.accessToken);
                  setRefreshToken(loginData.result.refreshToken);

                  // 온보딩 완료로 설정 (회원가입 후 바로 홈으로 이동)
                  completeOnboarding();

                  // 사용자 정보 저장 (회원가입 정보로 설정)
                  setUserInfo({
                    nickname: nickname,
                    email: email,
                    profileImage: profileImage || undefined,
                    points: 0,
                    age: age,
                    // 마케팅 수신동의 상태도 저장
                    isMarketing: signupData.isMarketing,
                    // 계좌 인증 상태는 회원가입 시 무조건 false
                    accountCertificationStatus: false,
                  });

                  // 로그인 상태 변경
                  login();

                  console.log('🔍 회원가입 후 자동 로그인 완료');
                }
              },
              onError: (loginError) => {
                console.error('🔍 자동 로그인 실패:', loginError);
                // 자동 로그인 실패 시 로그인 화면으로 이동
                navigation.navigate('EmailLogin');
              },
            },
          );
        },
        onError: (error) => {
          console.error('회원가입 실패:', error);
          // TODO: 에러 처리 (토스트 메시지 등)
        },
      },
    );
  };

  return (
    <Container>
      <Content>
        <PartyPopperImage
          source={require('../../assets/images/party_popper.png')}
          resizeMode="contain"
        />
        <Title>
          <HighlightText>{nickname}님</HighlightText>
          {'\n'}
          환영합니다!
        </Title>
        <SubTitle>
          머니핏을 통해{'\n'}
          AI가 추천하는 소비 플랜을{'\n'}
          시작해요!
        </SubTitle>
      </Content>

      <ButtonWrapper>
        <CustomButton
          text={isSigningUp ? '가입 중...' : '시작하기'}
          onPress={handleStart}
          disabled={isSigningUp}
          backgroundColor={
            isSigningUp ? theme.colors.gray200 : theme.colors.primary
          }
          textColor={isSigningUp ? theme.colors.gray500 : theme.colors.white}
        />
      </ButtonWrapper>
    </Container>
  );
};

export default WelcomeScreen;

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.white};
  justify-content: center;
  align-items: center;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const PartyPopperImage = styled.Image`
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-family: ${theme.fonts.SemiBold};
  font-size: ${theme.fonts.title}px;
  color: ${theme.colors.gray900};
  text-align: center;
  line-height: 34px;
`;

const HighlightText = styled.Text`
  color: ${theme.colors.primary};
`;

const SubTitle = styled.Text`
  font-family: ${theme.fonts.Regular};
  font-size: ${theme.fonts.body}px;
  color: ${theme.colors.gray600};
  text-align: center;
  line-height: 24px;
  margin-top: 16px;
`;

const ButtonWrapper = styled.View`
  width: 100%;
  padding: 24px;
`;
