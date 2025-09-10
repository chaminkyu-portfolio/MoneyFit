import React, { ReactNode } from 'react';
import { SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';
interface IProps {
  children: ReactNode;
}

const GradientContainer = ({ children }: IProps) => {
  return (
    <LinearGradient
      colors={[theme.colors.landing.start, theme.colors.landing.end]}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

const Wrapper = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const TopContent = styled.View`
  flex: 2;
  align-items: center;
  justify-content: flex-end;
`;

const MiddleContent = styled.View`
  flex: 3;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const BottomContent = styled.View`
  flex: 2;
  align-items: center;
  justify-content: center;
`;

const SubTitle = styled.Text`
  font-size: ${theme.fonts.subtitle}px;
  font-family: ${theme.fonts.SemiBold};
  line-height: 28px;
  letter-spacing: 0.1px;
  word-wrap: break-word;
`;

const Title = styled.Text`
  font-size: 64px;
  font-family: ${theme.fonts.Bold};
  color: ${theme.colors.white};
`;

const CharacterImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const LogoImage = styled.Image`
  width: 120px;
  height: 40px;
`;

const SplashScreen = () => {
  return (
    <GradientContainer>
      <Wrapper>
        <TopContent>
          <SubTitle>소비 습관 플래너</SubTitle>
          <Title>머니핏</Title>
        </TopContent>

        <MiddleContent>
          <CharacterImage
            source={require('../../assets/images/character_mori.png')}
            resizeMode="contain"
          />
        </MiddleContent>

        <BottomContent>
          <LogoImage
            source={require('../../assets/images/logo_heyoung.png')}
            resizeMode="contain"
          />
        </BottomContent>
      </Wrapper>
    </GradientContainer>
  );
};

export default SplashScreen;
