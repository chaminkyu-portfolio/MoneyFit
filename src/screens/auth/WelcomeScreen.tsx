import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { theme } from '../../styles/theme';
import AuthButton from '../../components/domain/auth/AuthButton';

// 유저 닉네임을 props로 받는다고 가정
const WelcomeScreen = ({ navigation, route }: any) => {
  const nickname = route.params?.nickname || '냥냥이';

  const handleStart = () => {
    // TODO: 온보딩 또는 메인 화면으로 이동
    // 예시: navigation.navigate('Onboarding');
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
          AI가 추천하는 갓생 플랜을{'\n'}
          시작해요!
        </SubTitle>
      </Content>

      <ButtonWrapper>
        <AuthButton text="시작하기" onPress={handleStart} />
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
  font-family: ${theme.fonts.Bold};
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
