import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import SocialLoginButton from '../../components/domain/auth/SocialLoginButton';
import { theme } from '../../styles/theme';
import { login as kakaoLogin, getProfile } from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import { useCheckOauth, useSignIn } from '../../hooks/user/useUser';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore, useOnboardingStore, useUserStore } from '../../store';
import { useErrorHandler } from '../../hooks/common/useErrorHandler';
import { Alert } from 'react-native';

const GradientContainer = styled(LinearGradient).attrs({
  colors: [theme.colors.landing.start, theme.colors.landing.end],
})`
  flex: 1;
`;

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
`;

const TopContent = styled.View`
  flex: 3;
  align-items: center;
  justify-content: center;
`;

const MiddleContent = styled.View`
  flex: 4;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const BottomContent = styled.View`
  flex: 3;
  width: 90%;
  align-items: center;
  justify-content: flex-start;
  padding-top: 20px;
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.SemiBold};
  color: #ffffff;
  margin-bottom: 4px;
`;

const Title = styled.Text`
  font-size: 40px;
  font-family: ${theme.fonts.SchoolsafeBold};
  color: #ffffff;
`;

const CharacterImage = styled.Image`
  width: 280px;
  height: 280px;
`;

const EmailLoginButton = styled.TouchableOpacity`
  margin-top: 12px;
`;

const EmailLoginText = styled.Text`
  font-size: ${theme.fonts.body}px;
  font-family: ${theme.fonts.Regular};
  color: #ffffff;
  text-decoration-line: underline;
`;

// --- 로그인 화면 컴포넌트 ---
const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [errorMessage, setErrorMessage] = useState('');

  //네이버 로그인 관련 설정
  const consumerKey = 'qZvKXPWWaSN8PubFK1t6';
  const consumerSecret = 'Ph_n6HgxRV';
  const appName = '머니핏';

  useEffect(() => {
    try {
      if (NaverLogin) {
        NaverLogin.initialize({ appName, consumerKey, consumerSecret });
      }
    } catch (e) {
      console.error('[NAVER] initialize error:', e);
    }
  }, []);

  //소셜유저 회원가입 체크 API 훅
  const { mutate: checkOauth } = useCheckOauth();

  // 로그인 API hook
  const { mutate: signIn, isPending: isSigningIn } = useSignIn();

  const { login, setAccessToken, setRefreshToken } = useAuthStore();
  const { completeOnboarding } = useOnboardingStore();
  const { setUserInfo } = useUserStore();
  const queryClient = useQueryClient();

  // 공통 에러 처리 훅
  const { handleApiError } = useErrorHandler();

  const handleLogin = (oauth: 'kakao' | 'naver') => {
    if (oauth === 'kakao') return handleKakaoLogin();
    if (oauth === 'naver') return handleNaverLogin();
  };

  const handleKakaoLogin = async () => {
    // 1) 카카오 로그인
    const tk = await kakaoLogin(); // { accessToken, refreshToken, ... }
    const me = await getProfile(); // { id, kakaoAccount: { email, profile: { nickname, ... } } }
    console.log("🔍 카카오 프로필 조회 : ", me.id);
    checkOauth(
      {
        email: me.email,
        provider: 'KAKAO',
        providerId: String(me.id)
      },
      {
        onSuccess: (data) => {
          const providerType = data.result;
          if (providerType === 'naver') {
            Alert.alert('', '이미 네이버 계정으로 가입된 이력이 있습니다.\n네이버 로그인으로 계속 진행해 주세요.', [
              { text: '확인', style: 'cancel' },
            ]);
          } else if (providerType === 'local') {
            Alert.alert('', '이미 가입되어 있는 이메일입니다.', [
              { text: '확인', style: 'cancel' },
            ]);
          } else if (providerType === '') {
            navigation.navigate('Age', {
              email: me.email,
              password: '',
              nickname: me.nickname,
              provider: 'KAKAO',
              providerId: me.id
            });
          } else {
            signIn(
              {
                email: me.email,
                password: ''
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
                      nickname: me.nickname, // 기본 닉네임
                      email: me.email,
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
          }
        },
      }
    );
  }

  const handleNaverLogin = async () => {
    const { failureResponse, successResponse } = await NaverLogin.login();
    if (successResponse) {
      const { accessToken, refreshToken, expiresAtUnixSecondString, tokenType } = successResponse;
      const me = await NaverLogin.getProfile(accessToken);
      console.log("🔍 네이버 프로필 조회 : ", me.response);
      checkOauth(
        {
          email: me.response.email.replace(/@jr\.naver\.com$/i, '@naver.com'),
          provider: 'NAVER',
          providerId: me.response.id
        },
        {
          onSuccess: (data) => {
            const providerType = data.result;
            if (providerType === 'kakao') {
              Alert.alert('', '이미 카카오 계정으로 가입된 이력이 있습니다.\n카카오 로그인으로 계속 진행해 주세요.', [
                { text: '확인', style: 'cancel' },
              ]);
            } else if (providerType === 'local') {
              Alert.alert('', '이미 가입되어 있는 이메일입니다.', [
                { text: '확인', style: 'cancel' },
              ]);
            } else if (providerType === '') {
              navigation.navigate('Age', {
                email: me.response.email,
                password: '',
                nickname: me.response.nickname,
                provider: 'NAVER',
                providerId: me.response.id
              });
            } else {
              signIn(
                {
                  email: me.response.email,
                  password: ''
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
                        nickname: me.response.nickname || '사용자', // 기본 닉네임
                        email: me.response.email,
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
            }
          },
        }
      );
    } else if (failureResponse) {
      console.error('🔍 네이버 로그인에 실패 :', failureResponse);
    }
  }

  return (
    <GradientContainer>
      <Wrapper>
        <TopContent>
          <SubTitle>소비 습관 플래너</SubTitle>
          <Title>머니핏</Title>
        </TopContent>

        <MiddleContent>
          <CharacterImage
            source={require('../../assets/images/home_pig.png')}
            resizeMode="contain"
          />
        </MiddleContent>

        <BottomContent>
          <SocialLoginButton
            type="kakao"
            onPress={() => handleLogin("kakao")}
          />
          <SocialLoginButton
            type="naver"
            onPress={() => handleLogin("naver")}
          />

          <EmailLoginButton onPress={() => navigation.navigate('EmailLogin')}>
            <EmailLoginText>이메일로 로그인</EmailLoginText>
          </EmailLoginButton>
        </BottomContent>
      </Wrapper>
    </GradientContainer>
  );
};

export default LoginScreen;
